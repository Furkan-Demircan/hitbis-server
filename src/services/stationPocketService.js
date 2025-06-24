import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import StationPocketModel from "../models/StationPocketModel.js";
import UserModel from "../models/UserModel.js";
import BikeRentalModel from "../models/BikeRentalModel.js";
import BikeModel from "../models/BikeModel.js";
import StationModel from "../models/StationModel.js";

const unlockPocket = async (slotCode) => {
    try {
        console.log(`[SERVICE] unlockPocket çağrıldı. Slot Kodu: ${slotCode}`);

        const pocket = await StationPocketModel.findOne({ slotCode });
        if (!pocket) {
            console.error(`[ERROR] Pocket bulunamadı: ${slotCode}`);
            return new ErrorResponse(404, "Pocket not found");
        }

        if (!pocket.bikeId || !pocket.isOccupied) {
            console.warn(`[WARN] Pocket boş veya bisiklet yok. Slot Kodu: ${slotCode}`);
            return new ErrorResponse(400, "No bike to unlock in this slot");
        }

        const payload = {
            command: "open",
            slotCode: slotCode,
        };

        const {
            publishMqttMessage,
            TOPIC_LOCK_OPEN_COMMAND_PREFIX,
            TOPIC_LOCK_OPEN_COMMAND_SUFFIX,
        } = await import("../services/mqttServices.js");

        const stationId = pocket.stationId.toString();
        // Topic yapısı: hitbis/station/[stationId]/lock/open/command
        const topic = `${TOPIC_LOCK_OPEN_COMMAND_PREFIX}${stationId}${TOPIC_LOCK_OPEN_COMMAND_SUFFIX}`;

        console.log(`[MQTT OUT] Kilit açma komutu gönderiliyor. Topic: ${topic}, Payload:`, payload);

        publishMqttMessage(
            TOPIC_LOCK_OPEN_COMMAND_PREFIX,
            TOPIC_LOCK_OPEN_COMMAND_SUFFIX,
            stationId,
            payload
        );

<<<<<<< HEAD
        return new SuccessResponse(
            null,
            "Unlock command sent to MQTT broker",
            null
        );
=======
        console.log("[MQTT OUT] Kilit açma komutu MQTT broker'a başarıyla yayınlandı.");

        return new SuccessResponse(null, "Unlock command sent to MQTT broker", null);
>>>>>>> 73e9a6e0c4f98e500ad9774424ac81e1727df8ab
    } catch (error) {
        console.error(`[ERROR] unlockPocket sırasında hata oluştu: ${error.message}`, error);
        return new ErrorResponse(500, "Failed to unlock pocket", error);
    }
};

// ADMIN ONLY
const createPocket = async (pocketData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({ _id: userId, role: "admin" });
        if (!isAdmin) {
            console.warn(`[AUTH] Yetkisiz kullanıcı (${userId}) cep oluşturmaya çalıştı.`);
            return new ErrorResponse(403, "Only admins can create pockets");
        }

        const station = await StationModel.findById(pocketData.stationId);
        if (!station) {
            console.error(`[ERROR] İstasyon bulunamadı: ${pocketData.stationId}`);
            return new ErrorResponse(404, "Station not found");
        }

        const existing = await StationPocketModel.findOne({
            slotCode: pocketData.slotCode,
        });

        if (existing) {
            console.warn(`[WARN] Bu QR koduna sahip slot zaten mevcut: ${pocketData.slotCode}`);
            return new ErrorResponse(
                400,
                "Slot with this QR code already exists"
            );
        }

        const newPocket = await StationPocketModel.create({
            stationId: pocketData.stationId,
            slotCode: pocketData.slotCode,
            isOccupied: false,
            bikeId: null,
        });

        return new SuccessResponse(
            newPocket,
            "Pocket created successfully",
            null
        );
    } catch (err) {
        return new ErrorResponse(500, "Failed to create pocket", err);
    }
};

// USER ONLY
const getPocketByQRCode = async (slotCode) => {
    try {
        const pocket = await StationPocketModel.findOne({ slotCode });

        if (!pocket) { // Pocket bulunamazsa ilk kontrol bu olmalı
            console.error(`[ERROR] Verilen QR koduyla cep bulunamadı: ${slotCode}`);
            return new ErrorResponse(404, "Pocket not found with given QR code");
        }

        if (!pocket.isOccupied || !pocket.bikeId) {
            console.warn(`[WARN] Bu slot şu anda boş: ${slotCode}`);
            return new ErrorResponse(400, "This slot is currently empty"); // 404 yerine 400 daha uygun olabilir
        }
        console.log(`[DB] Cep başarıyla alındı: ${pocket.slotCode}`);
        return new SuccessResponse(
            pocket,
            "Pocket retrieved successfully",
            null
        );
    } catch (error) {
        console.error(`[ERROR] getPocketByQRCode sırasında hata oluştu: ${error.message}`, error);
        return new ErrorResponse(500, "Failed to retrieve pocket", error);
    }
};

const onRFIDDetected = async (slotCode, rfidTag) => {
    try {
        console.log(`[SERVICE] onRFIDDetected çağrıldı. Slot Kodu: ${slotCode}, RFID Etiketi: ${rfidTag}`);

        const pocket = await StationPocketModel.findOne({ slotCode });
        if (!pocket) {
            console.error(`[ERROR] RFID için pocket bulunamadı: ${slotCode}`);
            return new ErrorResponse(404, "Pocket not found");
        }

        const bike = await BikeModel.findOne({ rfidTag });
        if (!bike) {
            console.error(`[ERROR] Verilen RFID (${rfidTag}) için bisiklet bulunamadı.`);
            return new ErrorResponse(404, "Bike not found for given RFID");
        }

        const rental = await BikeRentalModel.findOne({
            bikeId: bike._id,
            isReturned: false,
        });

        if (!rental) {
            return new ErrorResponse(
                400,
                "No active rental found for this bike"
            );
        }

        const endTime = new Date();
        const durationMinutes = Math.ceil(
            (endTime - rental.startTime) / (1000 * 60)
        );
        const fee = durationMinutes * 0.5;

        rental.endTime = endTime;
        rental.duration = durationMinutes;
        rental.totalFee = fee;
        rental.stationId_end = pocket.stationId;
        rental.isReturned = true;
        await rental.save();

        pocket.bikeId = bike._id;
        pocket.isOccupied = true;
        await pocket.save();
        console.log(`[DB] Cep güncellendi (bisiklet yerleştirildi). Slot Kodu: ${pocket.slotCode}`);

        bike.isAvailable = true;
        await bike.save();
        console.log(`[DB] Bisiklet güncellendi (artık müsait). Bisiklet ID: ${bike._id}`);

        // Servo motoru kapatma komutunu gönder
        const payload = {
            command: "close", // Kilidi kapatma komutu
            slotCode: slotCode,
        };

        const {
            publishMqttMessage,
            TOPIC_LOCK_CLOSE_COMMAND_PREFIX,
            TOPIC_LOCK_CLOSE_COMMAND_SUFFIX
        } = await import("../services/mqttServices.js"); // Bu import'un her zaman doğru yolu gösterdiğinden emin olun

        const stationId = pocket.stationId.toString();
        // Topic yapısı: hitbis/station/[stationId]/lock/close/command
        const topic = `${TOPIC_LOCK_CLOSE_COMMAND_PREFIX}${stationId}${TOPIC_LOCK_CLOSE_COMMAND_SUFFIX}`;

        console.log(`[MQTT OUT] Kilit kapatma komutu gönderiliyor. Topic: ${topic}, Payload:`, payload);

        publishMqttMessage(
            TOPIC_LOCK_CLOSE_COMMAND_PREFIX,
            TOPIC_LOCK_CLOSE_COMMAND_SUFFIX,
            stationId,
            payload
        );
        console.log("[MQTT OUT] Kilit kapatma komutu MQTT broker'a başarıyla yayınlandı.");


        return new SuccessResponse(
            {
                rentalId: rental._id,
                duration: durationMinutes,
                totalFee: fee,
                returnedAt: endTime,
                pocket: pocket.slotCode,
            },
            "Bike successfully returned and lock close command sent",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "RFID return failed", error);
    }
};

const clearPocket = async (pocketId) => {
    try {
        const pocket = await StationPocketModel.findById(pocketId);

        if (!pocket) {
            console.error(`[ERROR] Clear işlemi için cep bulunamadı: ${pocketId}`);
            return new ErrorResponse(404, "Pocket not found");
        }

        if (!pocket.isOccupied || !pocket.bikeId) {
            console.warn(`[WARN] Cep zaten boş: ${pocketId}`);
            return new ErrorResponse(400, "Pocket is already empty");
        }

        pocket.bikeId = null;
        pocket.isOccupied = false;
        await pocket.save();
        console.log(`[DB] Cep başarıyla temizlendi: ${pocket.slotCode}`);

        return new SuccessResponse(pocket, "Pocket cleared successfully", null);
    } catch (error) {
        console.error(`[ERROR] clearPocket sırasında hata oluştu: ${error.message}`, error);
        return new ErrorResponse(500, "Failed to clear pocket", error);
    }
};

const getPocketStatus = async (stationId) => {
    try {
        const pockets = await StationPocketModel.find({ stationId }).select(
            "slotCode isOccupied"
        );

        if (!pockets || pockets.length === 0) {
            console.warn(`[WARN] Bu istasyon (${stationId}) için cep bulunamadı.`);
            return new ErrorResponse(404, "No pockets found for this station");
        }
        console.log(`[DB] İstasyon (${stationId}) için cep durumu alındı. Toplam ${pockets.length} cep.`);
        return new SuccessResponse(
            pockets,
            "Pocket status retrieved successfully",
            pockets.length
        );
    } catch (err) {
        console.error(`[ERROR] getPocketStatus sırasında hata oluştu: ${err.message}`, err);
        return new ErrorResponse(500, "Failed to retrieve pocket status", err);
    }
};

export default {
    createPocket,
    getPocketByQRCode,
    onRFIDDetected,
    clearPocket,
    getPocketStatus,
    unlockPocket,
};