import mqtt from 'mqtt';
import dotenv from 'dotenv';
import stationPocketService from '../services/stationPocketService.js'; // StationPocketService'i import ettik

// .env dosyasındaki ortam değişkenlerini yükler
dotenv.config();

// ===========================================================================
// !!! BURADAKİ DEĞERLERİ .ENV DOSYANIZDAN GELEN BİLGİLERLE KONTROL EDİN !!!
// (Bu değerler olmadan MQTT bağlantısı kurulamaz ve kod çalışmaz)
// ===========================================================================

// MQTT Broker Bağlantı Bilgileri (Bu değerler .env dosyasında SET EDİLMELİDİR!)
const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST; // Direk .env'den okusun
const MQTT_BROKER_PORT = parseInt(process.env.MQTT_BROKER_PORT); // Direk .env'den okusun
const MQTT_USERNAME = process.env.MQTT_BROKER_USERNAME; // Direk .env'den okusun
const MQTT_PASSWORD = process.env.MQTT_BROKER_PASSWORD; // Direk .env'den okusun
// ===========================================================================

// ===========================================================================
// !!! MQTT TOPIC YAPILARI - BU DEĞERLERİ ESP32 İLE KARARLAŞTIRDIĞINIZ GİBİ DÜZENLEYİN !!!
// (Bu topic'ler ESP32'deki topic'lerle tam olarak EŞLEŞMELİDİR)
// ===========================================================================

// Backend'den ESP32'ye komut göndermek için Topic'ler
// Örnek: "hitbis/station/ISTASYON_ID/lock/open/command"
export const TOPIC_LOCK_OPEN_COMMAND_PREFIX = 'hitbis/station/'; 
export const TOPIC_LOCK_OPEN_COMMAND_SUFFIX = '/lock/open/command'; 

// Örnek: "hitbis/station/ISTASYON_ID/lock/close/command"
export const TOPIC_LOCK_CLOSE_COMMAND_PREFIX = 'hitbis/station/'; 
export const TOPIC_LOCK_CLOSE_COMMAND_SUFFIX = '/lock/close/command'; 

// ESP32'den Backend'e durum güncellemesi veya olay bildirmek için Topic'ler
// Örnek: "hitbis/station/rfid/detected" { "slotCode": "...", "rfidTag": "..." }
export const TOPIC_RFID_DETECTED_EVENT = 'hitbis/station/rfid/detected'; 

// Örnek: "hitbis/station/ISTASYON_ID/status/lock" { "status": "open"/"closed", "success": true/false }
export const TOPIC_LOCK_STATUS_UPDATE_PREFIX = 'hitbis/station/'; 
export const TOPIC_LOCK_STATUS_UPDATE_SUFFIX = '/status/lock'; 

// ===========================================================================

// MQTT istemcisini oluşturma seçenekleri
const options = {
    port: MQTT_BROKER_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    // clientId: 'backend_server_' + Math.random().toString(16).substr(2, 8), 
    // clean: true, 
    // keepalive: 60, 
};

const client = mqtt.connect(MQTT_BROKER_HOST, options);

// Bağlantı kurulduğunda
client.on('connect', () => {
    console.log('Connected to MQTT Broker!');
    // Backend'in dinlemesi gereken topic'lere abone ol
    // ESP32'den gelen RFID okuma ve kilit durumu güncellemelerini dinliyoruz
    client.subscribe(TOPIC_RFID_DETECTED_EVENT, (err) => { // TOPIC_RFID_DETECTED_EVENT olarak güncellendi
        if (err) console.error('Failed to subscribe to RFID detected topic:', err);
        else console.log(`Subscribed to ${TOPIC_RFID_DETECTED_EVENT}`);
    });
    // Tüm istasyonların kilit durumu güncellemelerini dinle: hitbis/station/+/status/lock
    client.subscribe(`${TOPIC_LOCK_STATUS_UPDATE_PREFIX}+${TOPIC_LOCK_STATUS_UPDATE_SUFFIX}`, (err) => { 
        if (err) console.error('Failed to subscribe to lock status update topic prefix:', err);
        else console.log(`Subscribed to ${TOPIC_LOCK_STATUS_UPDATE_PREFIX}+${TOPIC_LOCK_STATUS_UPDATE_SUFFIX}`);
    });
});

// Hata durumunda
client.on('error', (err) => {
    console.error('MQTT Connection error: ', err);
});

// Gelen MQTT mesajlarını işleme
client.on('message', async (topic, message) => {
    console.log(`Received message from topic: ${topic}: ${message.toString()}`);

    try {
        const parsedMessage = JSON.parse(message.toString());

        if (topic === TOPIC_RFID_DETECTED_EVENT) { // TOPIC_RFID_DETECTED_EVENT olarak güncellendi
            const { slotCode, rfidTag, stationId } = parsedMessage; // RFID mesajı içinde stationId de bekleyelim
            if (slotCode && rfidTag && stationId) {
                console.log(`MQTT: Processing RFID detection for slot ${slotCode} with RFID ${rfidTag} at station ${stationId}`);
                // RFID algılandığında StationPocketService.onRFIDDetected'i çağır
                // Not: onRFIDDetected sadece slotCode ve rfidTag alıyor, gerekirse imzasını güncelleyebiliriz.
                const result = await stationPocketService.onRFIDDetected(slotCode, rfidTag);
                console.log('RFID Detection Result:', result);
            } else {
                console.warn('MQTT: RFID detected message missing slotCode, rfidTag or stationId:', parsedMessage);
            }
        } else if (topic.startsWith(TOPIC_LOCK_STATUS_UPDATE_PREFIX) && topic.endsWith(TOPIC_LOCK_STATUS_UPDATE_SUFFIX)) { // TOPIC_LOCK_STATUS_UPDATE_PREFIX/SUFFIX olarak güncellendi
            const parts = topic.split('/'); 
            const stationId = parts[2]; // Örn: 'hitbis' 'station' 'ISTASYON_ID' 'status' 'lock'
            
            const { status, success, message: statusMessage } = parsedMessage;
            console.log(`MQTT: Lock status update for station ${stationId}: Status=${status}, Success=${success}, Message=${statusMessage}`);
            // TODO: İlgili kilit durumunu veritabanında güncelleme veya loglama mantığı buraya eklenebilir.
        }

    } catch (e) {
        console.error('MQTT: Failed to parse message or process it:', e);
    }
});

// MQTT mesajı yayınlama fonksiyonu
// Artık topic'i prefix, suffix ve dinamik stationId ile oluşturuyoruz
export const publishMqttMessage = (topicPrefix, topicSuffix, stationId, payload) => {
    const topic = `${topicPrefix}${stationId}${topicSuffix}`;
    if (client.connected) {
        client.publish(topic, JSON.stringify(payload), { qos: 1, retain: false }, (err) => { 
            if (err) {
                console.error(`MQTT: Failed to publish message to topic ${topic}:`, err);
            } else {
                console.log(`MQTT: Message published to topic ${topic}: ${JSON.stringify(payload)}`);
            }
        });
    } else {
        console.warn('MQTT: Client not connected, cannot publish message.');
    }
};

// MQTT istemcisinin kendisini de dışa aktarabiliriz
export default client;