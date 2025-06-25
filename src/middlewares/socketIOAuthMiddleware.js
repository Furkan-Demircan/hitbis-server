import jwt from "jsonwebtoken";
import { jwtOptions } from "../helpers/tokenHelper.js";

const socketAuthMiddleware = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token; // Client'tan token bu şekilde alınır
        if (!token) {
            return next(new Error("Token not found"));
        }
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY,
                jwtOptions
            );
            if (!decoded) {
                return next(new Error("Invalid token"));
            }
            socket.user = decoded; // Kullanıcı bilgisini socket'e ekle
            next();
        } catch (err) {
            console.log(err);
            return next(new Error("Invalid token"));
        }
    });
};

export default socketAuthMiddleware;
