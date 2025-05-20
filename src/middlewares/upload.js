import multer from "multer";
import path from "path";

// Dosyaları "uploads/" klasörüne kaydet
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // klasörü varsa
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${ext}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG/PNG allowed"), false);
        }
        cb(null, true);
    },
});

export default upload;
