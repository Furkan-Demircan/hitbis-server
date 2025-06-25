import mqtt from "mqtt";
import dotenv from "dotenv";
import stationPocketService from "../services/stationPocketService.js"; // StationPocketService'i import ettik

// .env dosyasındaki ortam değişkenlerini yükler
dotenv.config();

// --- MQTT BROKER BİLGİLERİ (Ortam Değişkenlerinden Alınır) ---
// Bu değerlerin .env dosyanızda doğru şekilde tanımlandığından emin olun!
const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST;
const MQTT_BROKER_PORT = parseInt(process.env.MQTT_BROKER_PORT, 10); // Sayısal değere dönüştür
const MQTT_USERNAME = process.env.MQTT_BROKER_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_BROKER_PASSWORD;

// --- MQTT TOPIC YAPILARI ---
// Bu topic'ler ESP32'deki topic'lerle tam olarak EŞLEŞMELİDİR!

// Backend'den ESP32'ye komut göndermek için Topic'ler
// Örnek: "hitbis/station/ISTASYON_ID/lock/open/command"
export const TOPIC_LOCK_OPEN_COMMAND_PREFIX = "hitbis/station/";
export const TOPIC_LOCK_OPEN_COMMAND_SUFFIX = "/lock/open/command";

// Örnek: "hitbis/station/ISTASYON_ID/lock/close/command"
export const TOPIC_LOCK_CLOSE_COMMAND_PREFIX = "hitbis/station/";
export const TOPIC_LOCK_CLOSE_COMMAND_SUFFIX = "/lock/close/command";

// ESP32'den Backend'e durum güncellemesi veya olay bildirmek için Topic'ler
// Örnek: "hitbis/station/rfid/detected" { "slotCode": "...", "rfidTag": "..." }
export const TOPIC_RFID_DETECTED_EVENT = "hitbis/station/rfid/detected";

// Örnek: "hitbis/station/ISTASYON_ID/status/lock" { "status": "open"/"closed", "success": true/false }
export const TOPIC_LOCK_STATUS_UPDATE_PREFIX = "hitbis/station/";
export const TOPIC_LOCK_STATUS_UPDATE_SUFFIX = "/status/lock";

// --- MQTT İstemci Yapılandırması ---
const clientOptions = {
    port: MQTT_BROKER_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    // clientId: `backend_server_${Math.random().toString(16).substr(2, 8)}`, // Benzersiz Client ID
    // clean: true, // Clean session'ı etkinleştir
    // keepalive: 60, // Keepalive süresi saniye cinsinden
    // rejectUnauthorized: false, // Sertifika doğrulamayı kapatır (geliştirme ortamı için tehlikelidir)
    // protocol: 'mqtts', // Broker'ınız SSL/TLS kullanıyorsa 'mqtts' kullanın
};

// MQTT istemcisini başlat
const client = mqtt.connect(MQTT_BROKER_HOST, clientOptions);

// --- MQTT Olay Dinleyicileri ---

// Bağlantı kurulduğunda
client.on("connect", () => {
    console.log("[MQTT] Backend MQTT Broker'a başarıyla bağlandı.");

    // RFID algılama olaylarını dinlemek için abone ol
    client.subscribe(TOPIC_RFID_DETECTED_EVENT, (err) => {
        if (err) {
            console.error(`[MQTT ERROR] ${TOPIC_RFID_DETECTED_EVENT} topic'ine abone olunurken hata:`, err);
        } else {
            console.log(`[MQTT] ${TOPIC_RFID_DETECTED_EVENT} topic'ine abone olundu.`);
        }
    });

    // Tüm istasyonların kilit durumu güncellemelerini dinlemek için abone ol
    // Topic formatı: hitbis/station/+/status/lock
    const lockStatusTopicWildcard = `${TOPIC_LOCK_STATUS_UPDATE_PREFIX}+${TOPIC_LOCK_STATUS_UPDATE_SUFFIX}`;
    client.subscribe(lockStatusTopicWildcard, (err) => {
        if (err) {
            console.error(`[MQTT ERROR] ${lockStatusTopicWildcard} topic'ine abone olunurken hata:`, err);
        } else {
            console.log(`[MQTT] ${lockStatusTopicWildcard} topic'ine abone olundu.`);
        }
    });
});

// Hata durumunda
client.on("error", (err) => {
    console.error(`[MQTT ERROR] MQTT bağlantı hatası: ${err.message}`);
});

// Gelen MQTT mesajlarını işleme
client.on("message", async (topic, message) => {
    console.log(`[MQTT IN] Mesaj alındı. Topic: ${topic}, Payload: ${message.toString()}`);

    try {
        const parsedMessage = JSON.parse(message.toString());

        // RFID Algılama Olayları
        if (topic === TOPIC_RFID_DETECTED_EVENT) {
            const { slotCode, rfidTag, stationId } = parsedMessage; // ESP32 kodunda stationId de ekledik
            if (slotCode && rfidTag && stationId) {
                console.log(`[EVENT] RFID algılandı. İstasyon: ${stationId}, Slot: ${slotCode}, RFID: ${rfidTag}`);
                // RFID algılandığında StationPocketService.onRFIDDetected'i çağır
                const result = await stationPocketService.onRFIDDetected(
                    slotCode,
                    rfidTag
                );
                // Servis cevabını logla
                if (result.success) {
                    console.log("[SERVICE RESPONSE] RFID algılama ve iade işlemi başarılı:", result.data);
                } else {
                  //  console.error("[SERVICE RESPONSE ERROR] RFID algılama ve iade işlemi başarısız:", result.error);
                }
            } else {
                console.warn(
                    "[WARN] RFID algılama mesajı eksik bilgi içeriyor (slotCode, rfidTag veya stationId):",
                    parsedMessage
                );
            }
        }
        // Kilit Durumu Güncellemeleri (Servo Motor Durumu)
        else if (
            topic.startsWith(TOPIC_LOCK_STATUS_UPDATE_PREFIX) &&
            topic.endsWith(TOPIC_LOCK_STATUS_UPDATE_SUFFIX)
        ) {
            // Topic'ten stationId'yi çıkar
            const parts = topic.split("/"); // Örn: ['hitbis', 'station', '1901', 'status', 'lock']
            const stationIdIndex = 2; // Bu, istasyon ID'sinin bulunduğu indeks
            const stationId = parts[stationIdIndex];

            const { status, success, slotCode, message: statusMessage } = parsedMessage; // ESP32'den slotCode da bekliyoruz
            console.log(
                `[SERVO STATUS FROM ESP] İstasyon: ${stationId}, Slot: ${slotCode || 'Bilinmiyor'}, Durum: ${status}, Başarı: ${success}, Mesaj: ${statusMessage || 'Yok'}`
            );
            // TODO: İlgili kilit durumunu veritabanında güncelleme veya daha ileri işleme mantığı buraya eklenebilir.
            // Örneğin:
            // await StationPocketModel.findOneAndUpdate({ stationId, slotCode }, { lockStatus: status });
        }
    } catch (e) {
        console.error(`[ERROR] Gelen mesaj ayrıştırılırken veya işlenirken hata oluştu: ${e.message}`, e);
    }
});

// MQTT mesajı yayınlama fonksiyonu
export const publishMqttMessage = (
    topicPrefix,
    topicSuffix,
    stationId,
    payload
) => {
    const topic = `${topicPrefix}${stationId}${topicSuffix}`;
    if (client.connected) {
        client.publish(
            topic,
            JSON.stringify(payload),
            { qos: 1, retain: false }, // QoS ve retain ayarlarını kontrol edin
            (err) => {
                if (err) {
                    console.error(
                        `[MQTT OUT ERROR] Mesaj ${topic} topic'ine yayınlanırken hata:`,
                        err
                    );
                } else {
                    console.log(
                        `[MQTT OUT] Mesaj ${topic} topic'ine başarıyla yayınlandı. Payload: ${JSON.stringify(
                            payload
                        )}`
                    );
                }
            }
        );
    } else {
        console.warn("[MQTT WARN] MQTT istemcisi bağlı değil, mesaj yayınlanamadı.");
    }
};

// MQTT istemcisinin kendisini de dışa aktarabiliriz (gerekliyse)
export default client;