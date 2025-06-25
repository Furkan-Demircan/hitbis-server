import redis from "redis";

class RedisModel {
    constructor() {
        // Redis bağlantı URL'sini çevresel değişkenden al
        const redisUrl = process.env.REDIS_PUBLIC_URL;

        // Redis client'ını URL ile başlat
        this.client = redis.createClient({
            url: redisUrl, // URL üzerinden bağlantı
        });

        // Redis bağlantısını başlat
        this.client.connect();

        // Redis bağlantı hatalarını kontrol et
        this.client.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    // Kullanıcının konumunu Redis'e ekler
    async addUserLocation(userId, coords) {
        await this.client.geoAdd("active_riders", {
            longitude: coords[1], // longitude
            latitude: coords[0], // latitude
            member: userId,
        });
    }

    // Yakındaki kullanıcıları getirir
    async getNearbyUsers(coords, radius = 250) {
        return await this.client.geoSearch(
            "active_riders",
            { longitude: coords[1], latitude: coords[0] },
            { radius, unit: "m" }
        );
    }

    // Kullanıcıyı Redis'ten kaldırır
    async removeUser(userId) {
        await this.client.geoRemove("active_riders", userId);
    }
}

export default new RedisModel();
