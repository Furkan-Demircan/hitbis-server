// mqttServices.js

import mqtt from "mqtt";
import dotenv from "dotenv";
import stationPocketService from "../services/stationPocketService.js"; // StationPocketService'i import ettik

dotenv.config();

const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST;
const MQTT_BROKER_PORT = parseInt(process.env.MQTT_BROKER_PORT, 10);
const MQTT_USERNAME = process.env.MQTT_BROKER_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_BROKER_PASSWORD;

// --- YENİ MQTT TOPIC YAPILARI (ESP32 ile Uyumlu) ---
// ESP32'nin dinleyeceği komut topici
// Örnek: "hitbis/istasyon/kontrol/190207"
export const TOPIC_COMMAND_BASE = "hitbis/istasyon/kontrol/";

// ESP32'den Backend'e durum güncellemesi veya olay bildirmek için Topic'ler
// ESP32'den gelen tüm durum güncellemeleri (RFID algılama da dahil) bu topice gelir: "hitbis/istasyon/durum/SLOT_CODE"
export const TOPIC_STATUS_UPDATE_BASE = "hitbis/istasyon/durum/";

// NOT: TOPIC_RFID_DETECTED_EVENT artık doğrudan kullanılmıyor,
// çünkü ESP32 tüm durumları TOPIC_STATUS_UPDATE_BASE altında gönderiyor.
// Bu değişkeni kaldırabilir veya ileride RFID için özel bir topic kullanmak isterseniz tutabilirsiniz.
// Şimdilik abonelik ve mesaj işleme mantığında TOPIC_STATUS_UPDATE_BASE'i kullanacağız.


const clientOptions = {
    port: MQTT_BROKER_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    // Diğer seçenekleriniz...
    protocol: 'mqtts',
    rejectUnauthorized: false,
};

const client = mqtt.connect(MQTT_BROKER_HOST, clientOptions);

client.on("connect", () => {
    console.log("[MQTT] Backend MQTT Broker'a başarıyla bağlandı.");

    // Daha önce burada TOPIC_RFID_DETECTED_EVENT'e abone oluyordunuz.
    // Ancak ESP32 artık RFID mesajlarını TOPIC_STATUS_UPDATE_BASE altında gönderdiği için
    // bu abonelik gereksizdi ve mesajın işlenmesini engelliyordu.
    // Sadece TOPIC_STATUS_UPDATE_BASE'e wildcard ile abone olmamız yeterli.

    // Tüm istasyonların kendi durum güncellemelerini dinlemek için abone ol
    // Topic formatı: hitbis/istasyon/durum/+ (buradaki '+' herhangi bir slotCode'u temsil eder)
    const statusUpdateTopicWildcard = `${TOPIC_STATUS_UPDATE_BASE}+`;
    client.subscribe(statusUpdateTopicWildcard, (err) => {
        if (err) {
            console.error(`[MQTT ERROR] ${statusUpdateTopicWildcard} topic'ine abone olunurken hata:`, err);
        } else {
            console.log(`[MQTT] ${statusUpdateTopicWildcard} topic'ine abone olundu.`);
        }
    });
});

client.on("error", (err) => {
    console.error(`[MQTT ERROR] MQTT bağlantı hatası: ${err.message}`);
});

client.on("message", async (topic, message) => {
    console.log(`[MQTT IN] Mesaj alındı. Topic: ${topic}, Payload: ${message.toString()}`);

    try {
        const parsedMessage = JSON.parse(message.toString());

        // Gelen mesaj TOPIC_STATUS_UPDATE_BASE ile başlıyorsa ve status "RFID_Kart_Okundu" ise bu bir RFID algılama olayıdır.
        if (topic.startsWith(TOPIC_STATUS_UPDATE_BASE) && parsedMessage.status === "RFID_Kart_Okundu") {
            const { slotCode, rfidTag } = parsedMessage; // Payload'da doğrudan rfidTag bekliyoruz

            if (slotCode && rfidTag) {
                console.log(`[EVENT] RFID algılandı. Slot: ${slotCode}, RFID: ${rfidTag}`);
                
                // *** YENİ EKLENEN KISIM: KISA BİR GECİKME EKLEYELİM ***
                // Bu, kiralama kaydının veritabanına tam olarak yazılmasına zaman tanıyabilir.
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye gecikme
                console.log("[DEBUG] 1 saniye gecikme sonrası RFID işleme devam ediyor...");
                // ******************************************************

                // RFID algılandığında StationPocketService.onRFIDDetected'i çağır
                const result = await stationPocketService.onRFIDDetected(
                    slotCode,
                    rfidTag
                );
                if (result.success) {
                    console.log("[SERVICE RESPONSE] RFID algılama ve iade işlemi başarılı:", result.data);
                } else {
                    console.error("[SERVICE RESPONSE ERROR] RFID algılama ve iade işlemi başarısız:", result.error);
                }
            } else {
                console.warn(
                    "[WARN] RFID algılama mesajı eksik bilgi içeriyor (slotCode veya rfidTag eksik):",
                    parsedMessage
                );
            }
        }
        // Diğer durum güncellemeleri (örneğin istasyonun online olması)
        else if (topic.startsWith(TOPIC_STATUS_UPDATE_BASE)) {
            const { status, slotCode } = parsedMessage;
            console.log(
                `[SERVO STATUS FROM ESP] Slot: ${slotCode || 'Bilinmiyor'}, Durum: ${status}`
            );
            // TODO: İlgili kilit durumunu veritabanında güncelleme veya daha ileri işleme mantığı buraya eklenebilir.
        }
    } catch (e) {
        console.error(`[ERROR] Gelen mesaj ayrıştırılırken veya işlenirken hata oluştu: ${e.message}`, e);
    }
});

// MQTT mesajı yayınlama fonksiyonu (Topic ve Payload'ı direkt alacak şekilde güncellendi)
export const publishMqttMessage = (topic, payload) => {
    if (client.connected) {
        client.publish(
            topic,
            JSON.stringify(payload),
            { qos: 1, retain: false },
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

export default client;