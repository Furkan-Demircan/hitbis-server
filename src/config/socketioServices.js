// services/socketService.js
import { Server } from "socket.io";
import redis from "redis";

class SocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        this.redisClient = redis.createClient();
        this.redisClient.connect();

        this.activeUsers = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`Yeni bağlantı: ${socket.id}`);

            // Konum güncelleme olayı
            socket.on(
                "locationUpdate",
                this.handleLocationUpdate.bind(this, socket)
            );

            // Bağlantı kesilme olayı
            socket.on("disconnect", this.handleDisconnect.bind(this, socket));
        });
    }

    async handleLocationUpdate(socket, data) {
        try {
            const { userId, coordinates } = data;

            // Redis'e konum ekle
            await this.redisClient.geoAdd("active_riders", {
                longitude: coordinates[1],
                latitude: coordinates[0],
                member: userId,
            });

            // Aktif kullanıcıları güncelle
            this.activeUsers.set(userId, socket.id);

            // Yakındaki sürücüleri bul ve gönder
            const nearby = await this.redisClient.geoSearch(
                "active_riders",
                { longitude: coordinates[1], latitude: coordinates[0] },
                { radius: 250, unit: "m" }
            );

            socket.emit("nearbyRiders", nearby);
        } catch (error) {
            console.error("Konum güncelleme hatası:", error);
        }
    }

    async handleDisconnect(socket) {
        for (const [userId, sockId] of this.activeUsers.entries()) {
            if (sockId === socket.id) {
                await this.redisClient.zRem("active_riders", userId);
                this.activeUsers.delete(userId);
                break;
            }
        }
        console.log(`Bağlantı kesildi: ${socket.id}`);
    }

    getIO() {
        return this.io;
    }
}

export default SocketService;
