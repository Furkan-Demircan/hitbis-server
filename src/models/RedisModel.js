import redis from "redis";
class RedisModel {
    constructor() {
        this.client = redis.createClient();
        this.client.connect();

        this.client.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    async addUserLocation(userId, coords) {
        await this.client.geoAdd("active_riders", {
            longitude: coords[1],
            latitude: coords[0],
            member: userId,
        });
    }

    async getNearbyUsers(coords, radius = 250) {
        return await this.client.geoSearch(
            "active_riders",
            { longitude: coords[1], latitude: coords[0] },
            { radius, unit: "m" }
        );
    }

    async removeUser(userId) {
        await this.client.zRem("active_riders", userId);
    }
}

export default new RedisModel();
