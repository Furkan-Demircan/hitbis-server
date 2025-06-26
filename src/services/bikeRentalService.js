import BikeRentalModel from "../models/BikeRentalModel.js";
import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import StationPocketModel from "../models/StationPocketModel.js";
import BikeModel from "../models/BikeModel.js";
import stationPocketService from "./stationPocketService.js";

const rentBike = async (slotCode, userId) => {
    try {
        console.log(`[SERVICE] rentBike çağrıldı. Slot Kodu: ${slotCode}, Kullanıcı ID: ${userId}`); // Yeni log

        const pocket = await StationPocketModel.findOne({ slotCode });
        if (!pocket) {
            console.error(`[RENT ERROR] Slot bulunamadı: ${slotCode}`); // Daha spesifik hata logu
            return new ErrorResponse(404, "Slot not found");
        }
        console.log(`[RENT DEBUG] Cep bulundu: ${pocket.slotCode}, Current BikeId in Pocket: ${pocket.bikeId}`); // Yeni log

        // Kullanıcının zaten aktif bir kiralaması var mı kontrolü
        const activeRental = await BikeRentalModel.findOne({
            userId: userId,
            isReturned: false,
        });

        if (activeRental) {
            console.warn(`[RENT WARN] Kullanıcının zaten aktif kiralaması var: ${userId}, Aktif Kiralama ID: ${activeRental._id}`); // Yeni log
            return new ErrorResponse(400, "You already have an active rental");
        }
        console.log("[RENT DEBUG] Kullanıcının aktif kiralaması yok, devam ediliyor."); // Yeni log


        // Kiralancak bisikleti bulma ve müsaitlik kontrolü
        const bike = await BikeModel.findById(pocket.bikeId);
        if (!bike || !bike.isAvailable) {
            console.error(`[RENT ERROR] Bisiklet bulunamadı (${pocket.bikeId}) veya müsait değil. isAvailable: ${bike ? bike.isAvailable : 'N/A'}`); // Yeni log
            return new ErrorResponse(404, "Bike not found or not available");
        }
        console.log(`[RENT DEBUG] Bisiklet bulundu: ID: ${bike._id}, BikeCode: ${bike.bikeCode}, RFID: ${bike.rfidTag}`); // Yeni log

        // Yeni kiralama kaydı oluşturma
        console.log("[RENT DEBUG] Yeni kiralama kaydı oluşturuluyor..."); // Yeni log
        const rental = await BikeRentalModel.create({
            userId: userId,
            bikeId: pocket.bikeId, // Cebin içindeki bisikletin ID'si
            stationId_start: pocket.stationId,
            startTime: new Date(),
            isReturned: false, // Başlangıçta iade edilmedi olarak işaretle
            qrCodeData: slotCode, // QR kod verisini kaydet
        });

        if (!rental) {
            console.error("[RENT ERROR] Kiralama kaydı oluşturulamadı (veritabanı hatası?)."); // Yeni log
            return new ErrorResponse(500, "Failed to create rental record");
        }
        console.log(`[RENT SUCCESS] Kiralama kaydı başarıyla oluşturuldu. Rental ID: ${rental._id}`); // Yeni log

        // Servo motoru açma komutu gönderme
        await stationPocketService.unlockPocket(slotCode);
        console.log(`[RENT DEBUG] Kilit açma komutu stationPocketService'e gönderildi: ${slotCode}`); // Yeni log

        // Cep ve bisiklet durumlarını güncelleme
        pocket.bikeId = null; // Cep artık boş
        pocket.isOccupied = false; // Cep boş olarak işaretlendi
        await pocket.save();
        console.log(`[RENT DEBUG] Cep durumu güncellendi (boş): ${pocket.slotCode}`); // Yeni log

        bike.isAvailable = false; // Bisiklet artık müsait değil (kiralanmış)
        await bike.save();
        console.log(`[RENT DEBUG] Bisiklet durumu güncellendi (müsait değil): ${bike.bikeCode}`); // Yeni log

        // Başarılı yanıt döndürme
        return new SuccessResponse(
            {
                rentalId: rental._id,
                bikeCode: bike.bikeCode,
                startTime: rental.startTime,
                fromStation: pocket.stationId,
                slotCode: slotCode,
            },
            "Bike rented successfully",
            null
        );
    } catch (err) {
        // Hata yakalandığında daha detaylı loglama
        console.error(`[RENT CRITICAL ERROR] rentBike sırasında beklenmedik hata: ${err.message}`, err);
        return new ErrorResponse(
            500,
            "Something went wrong while renting the bike"
        );
    }
};

const getRentalHistory = async (userId) => {
    try {
        const rentals = await BikeRentalModel.find({ userId: userId })
            .populate("bikeId")
            .populate("stationId_start")
            .populate("stationId_end")
            .sort({ startTime: -1 });

        if (!rentals || rentals.length === 0) {
            console.warn(`[RENTAL HISTORY] Kullanıcı (${userId}) için kiralama geçmişi bulunamadı.`);
            return new ErrorResponse(404, "No rental history found");
        }
        console.log(`[RENTAL HISTORY] Kullanıcı (${userId}) için ${rentals.length} kiralama kaydı bulundu.`);
        return new SuccessResponse(
            rentals,
            "Rental history retrieved successfully",
            null
        );
    } catch (err) {
        console.error(`[RENTAL HISTORY ERROR] getRentalHistory sırasında hata: ${err.message}`, err);
        return new ErrorResponse(
            500,
            "Something went wrong while retrieving rental history"
        );
    }
};

const getCurrentRentalStatus = async (userId) => {
    try {
        const rental = await BikeRentalModel.findOne({
            userId: userId,
            isReturned: false,
        })
            .populate("bikeId")
            .populate("stationId_start")
            .populate("stationId_end");

        if (!rental) {
            console.warn(`[CURRENT RENTAL] Kullanıcı (${userId}) için aktif kiralama bulunamadı.`);
            return new ErrorResponse(404, "No active rental found");
        }
        console.log(`[CURRENT RENTAL] Kullanıcı (${userId}) için aktif kiralama bulundu: ${rental._id}`);
        return new SuccessResponse(
            rental,
            "Current rental status retrieved successfully",
            null
        );
    } catch (err) {
        console.error(`[CURRENT RENTAL ERROR] getCurrentRentalStatus sırasında hata: ${err.message}`, err);
        return new ErrorResponse(
            500,
            "Something went wrong while retrieving current rental status"
        );
    }
};

export default {
    rentBike,
    getRentalHistory,
    getCurrentRentalStatus,
};