import mqtt from 'mqtt';
import dotenv from 'dotenv';

// .env dosyasındaki ortam değişkenlerini yükler
dotenv.config();

// ===========================================================================
// !!! BURADAKİ DEĞERLERİ  ALDIĞINIZ BİLGİLERLE DEĞİŞTİRİN !!!
// (Bu değerler olmadan MQTT bağlantısı kurulamaz ve kod çalışmaz)
// ===========================================================================

// MQTT Broker Bağlantı Bilgileri
// Örnek: 'mqtt://broker.hivemq.com' veya 'mqtt://192.168.1.100'
const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST || 'mqtt://YOUR_MQTT_BROKER_HOST'; 
// Örnek: 1883 (şifresiz) veya 8883 (SSL/TLS)
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT ? parseInt(process.env.MQTT_BROKER_PORT) : 1883; 
const MQTT_USERNAME = process.env.MQTT_USERNAME || ''; // Eğer kimlik doğrulama varsa, buraya kullanıcı adınızı girin
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || ''; // Eğer kimlik doğrulama varsa, buraya şifrenizi girin

// ===========================================================================

// ===========================================================================
// !!! MQTT TOPIC YAPILARI -  KARARLAŞTIRDIĞINIZ GİBİ DÜZENLEYİN !!!
// (Bu topic'ler ESP32'deki topic'lerle tam olarak eşleşmeli)
// ===========================================================================

// Backend'den ESP32'ye komut göndermek için Topic'ler
// Örnek: "station/lock/open/command/ISTASYON_ID"
export const TOPIC_LOCK_OPEN_COMMAND_PREFIX = 'station/lock/open/command/'; 
// Örnek: "station/lock/close/command/ISTASYON_ID"
export const TOPIC_LOCK_CLOSE_COMMAND_PREFIX = 'station/lock/close/command/'; 

// ESP32'den Backend'e durum güncellemesi veya olay bildirmek için Topic'ler
// Örnek: "station/rfid/detected" { "slotCode": "...", "rfidTag": "..." }
export const TOPIC_RFID_DETECTED = 'station/rfid/detected'; 
// Örnek: "station/lock/status/ISTASYON_ID" { "status": "open"/"closed", "success": true/false }
export const TOPIC_LOCK_STATUS_UPDATE = 'station/lock/status/'; 

// ===========================================================================

// MQTT istemcisini oluşturma seçenekleri
const options = {
    port: MQTT_BROKER_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    // clientId: 'backend_server_' + Math.random().toString(16).substr(2, 8), // Benzersiz Client ID
    // clean: true, // true = clean session, false = persistent session
    // keepalive: 60, // Saniye cinsinden keepalive interval
};

const client = mqtt.connect(MQTT_BROKER_HOST, options);

// Bağlantı kurulduğunda
client.on('connect', () => {
    console.log('Connected to MQTT Broker!');
    // Backend'in dinlemesi gereken topic'lere abone ol
    // ESP32'den gelen RFID okuma ve kilit durumu güncellemelerini dinliyoruz
    client.subscribe(TOPIC_RFID_DETECTED, (err) => {
        if (err) console.error('Failed to subscribe to RFID detected topic:', err);
        else console.log(`Subscribed to ${TOPIC_RFID_DETECTED}`);
    });
    client.subscribe(TOPIC_LOCK_STATUS_UPDATE + '#', (err) => { // Tüm istasyonların durum güncellemelerini dinle
        if (err) console.error('Failed to subscribe to lock status update topic prefix:', err);
        else console.log(`Subscribed to ${TOPIC_LOCK_STATUS_UPDATE}#`);
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

        if (topic === TOPIC_RFID_DETECTED) {
            // ESP32'den gelen RFID okuma mesajını StationPocketService'e iletmek için
            // Burada doğrudan StationPocketService'i import etmek yerine
            // bir olay sistemi veya API çağrısı kullanmak daha iyidir.
            // Şimdilik sadece logluyoruz.
            const { slotCode, rfidTag } = parsedMessage;
            if (slotCode && rfidTag) {
                console.log(`MQTT: Processing RFID detection for slot ${slotCode} with RFID ${rfidTag}`);
                // TODO: Buradan StationPocketService.onRFIDDetected fonksiyonunu çağırın.
                // Örneğin: import stationPocketService from '../services/stationPocketService.js';
                //          await stationPocketService.onRFIDDetected(slotCode, rfidTag);
                // NOT: Bu doğrudan import, import döngülerine neden olabilir.
                // Daha sağlam bir yapı için bir Event Emitter kullanmak veya bu MQTT mesajlarını
                // bir API endpoint'ine yönlendirmek (HTTP isteği ile) gerekebilir.
            }
        } else if (topic.startsWith(TOPIC_LOCK_STATUS_UPDATE)) {
            // Kilit durumu güncellemelerini işle
            const stationId = topic.split('/').pop(); // Topic'ten istasyon ID'sini al
            const { status, success, message: statusMessage } = parsedMessage; // message'i statusMessage olarak yeniden adlandır
            console.log(`MQTT: Lock status update for station ${stationId}: Status=${status}, Success=${success}, Message=${statusMessage}`);
            // TODO: İlgili kilit durumunu veritabanında güncelleme veya loglama mantığı buraya eklenebilir.
        }

    } catch (e) {
        console.error('MQTT: Failed to parse message or process it:', e);
    }
});

// MQTT mesajı yayınlama fonksiyonu
export const publishMqttMessage = (topic, message) => {
    if (client.connected) {
        client.publish(topic, JSON.stringify(message), { qos: 1, retain: false }, (err) => {
            if (err) {
                console.error(`MQTT: Failed to publish message to topic ${topic}:`, err);
            } else {
                console.log(`MQTT: Message published to topic ${topic}: ${JSON.stringify(message)}`);
            }
        });
    } else {
        console.warn('MQTT: Client not connected, cannot publish message.');
    }
};

// MQTT istemcisinin kendisini de dışa aktarabiliriz (nadiren doğrudan kullanılır)
export default client;