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
// Örnek: "hitbis/station/rfid/detected" { "slotCode": "...", "rfidTag": "..." }
export const TOPIC_RFID_DETECTED_EVENT = "hitbis/station/rfid/detected"; // Bu topic'i ESP32 kodunda publishStatus içinde kullanacağız

// Örnek: "hitbis/istasyon/durum/190207" { "status": "...", "slotCode": "..." }
export const TOPIC_STATUS_UPDATE_BASE = "hitbis/istasyon/durum/";


const clientOptions = {
    port: MQTT_BROKER_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    // Diğer seçenekleriniz...
    protocol: 'mqtts', // Önceki konuşmalarımızda 8883 portunu kullandığınızı belirttiniz, bu da SSL/TLS anlamına gelir.
    rejectUnauthorized: false, // Güvenilir bir sertifika kullanmıyorsanız geliştirme ortamında bu gerekli olabilir.
                               // Üretim ortamında kesinlikle true olmalıdır.
};

const client = mqtt.connect(MQTT_BROKER_HOST, clientOptions);

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

        // RFID Algılama Olayları (ESP32'den gelen RFID okuma mesajları)
        if (topic === TOPIC_RFID_DETECTED_EVENT) {
            // ESP32 kodunda publishStatus fonksiyonu RFID okuduğunda
            // "RFID_Kart_Okundu: [UID]" şeklinde bir status gönderiyor.
            // Bu mesaja ek olarak slotCode'u da ekledik ESP32'de.
            const { status, slotCode } = parsedMessage; 
            const rfidTagMatch = status.match(/RFID_Kart_Okundu: (.*)/); // RFID_Kart_Okundu: UID formatını yakala

            if (rfidTagMatch && slotCode) {
                const rfidTag = rfidTagMatch[1].trim(); // UID'yi al
                console.log(`[EVENT] RFID algılandı. Slot: ${slotCode}, RFID: ${rfidTag}`);
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
                    "[WARN] RFID algılama mesajı eksik bilgi içeriyor (status veya slotCode eksik):",
                    parsedMessage
                );
            }
        }
        // Kilit Durumu Güncellemeleri (ESP32'den gelen servo durumu)
        else if (topic.startsWith(TOPIC_STATUS_UPDATE_BASE)) {
            const { status, slotCode } = parsedMessage; // ESP32'den gelen payload'da status ve slotCode bekliyoruz
            console.log(
                `[SERVO STATUS FROM ESP] Slot: ${slotCode || 'Bilinmiyor'}, Durum: ${status}`
            );
            // TODO: İlgili kilit durumunu veritabanında güncelleme veya daha ileri işleme mantığı buraya eklenebilir.
            // Örneğin:
            // await StationPocketModel.findOneAndUpdate({ slotCode }, { lockStatus: status });
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