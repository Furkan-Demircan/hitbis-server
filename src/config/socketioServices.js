import { Server } from "socket.io";
import SocketController from "../controllers/SocketController.js";

class SocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        // SocketController'ı başlat
        this.socketController = new SocketController(this.io);
    }

    getIO() {
        return this.io;
    }
}

export default SocketService;
