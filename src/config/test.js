import redis from "redis";

// Redis URL'ini çevresel değişkenden al
const redisUrl = process.env.REDIS_PUBLIC_URL;

const redisClient = redis.createClient({
    url: redisUrl,
});

async function testRedisConnection() {
    try {
        // Redis'e bağlanmaya çalışın
        await redisClient.connect();
        console.log("Redis bağlantısı başarılı.");

        // Test veri ekleyin
        await redisClient.set("testKey", "Hello Redis!");
        console.log("Test veri Redis'e eklendi.");

        // Veriyi alın
        const value = await redisClient.get("testKey");
        console.log("Test verisi alındı:", value); // Beklenen: 'Hello Redis!'

        // Redis bağlantısını kapatın
        await redisClient.quit();
    } catch (error) {
        console.error("Redis bağlantı hatası:", error);
    }
}

testRedisConnection();
