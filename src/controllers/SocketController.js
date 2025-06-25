import RedisModel from "../models/RedisModel";

class SocketController {
    constructor(io) {
        this.io = io;
        this.activeUsers = new Map();
    }

    handleConnection(socket) {
        console.log(`New connection: ${socket.id}`);

        socket.on("locationUpdate", (data) => {
            this.handleLocationUpdate(socket, data);
        });

        socket.on("disconnect", () => {
            this.handleDisconnect(socket);
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
        // Kullanıcıyı aktiflerden kaldır
        for (const [userId, sockId] of this.activeUsers.entries()) {
            if (sockId === socket.id) {
                await RedisModel.removeUser(userId);
                this.activeUsers.delete(userId);
                break;
            }
        }
    }
}

export default SocketController;
