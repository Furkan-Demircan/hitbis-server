import RedisModel from "../models/RedisModel.js";

class SocketController {
    constructor(io) {
        this.io = io;
        this.activeUsers = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`New connection: ${socket.id}`);

            // Handle location updates
            socket.on("locationUpdate", (data) => {
                this.handleLocationUpdate(socket, data);
            });

            // Handle user disconnect
            socket.on("disconnect", () => {
                this.handleDisconnect(socket);
            });
        });
    }

    async handleLocationUpdate(socket, { userId, coordinates }) {
        try {
            // 1. Veritabanına kaydet
            await RedisModel.addUserLocation(userId, coordinates);

            // 2. Aktif kullanıcı listesini güncelle
            this.activeUsers.set(userId, socket.id);

            // 3. Yakındaki kullanıcıları bul
            const nearbyUsers = await RedisModel.getNearbyUsers(coordinates);

            // 4. İlgili kullanıcıya gönder
            socket.emit("nearbyRiders", nearbyUsers);
        } catch (err) {
            console.error("Location update error:", err);
            socket.emit("error", "Konum güncellenemedi");
        }
    }

    async handleDisconnect(socket) {
        // 1. Bağlantı kesildiğinde aktif kullanıcı listesinden çıkar
        for (const [userId, sockId] of this.activeUsers.entries()) {
            if (sockId === socket.id) {
                // 2. Redis'ten kullanıcıyı kaldır
                await RedisModel.removeUser(userId);
                this.activeUsers.delete(userId);
                break;
            }
        }
        console.log(`Connection disconnected: ${socket.id}`);
    }
}

export default SocketController;
