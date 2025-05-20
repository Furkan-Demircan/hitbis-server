import { ErrorResponse } from "../helpers/responseHelper.js";
import userServices from "../services/userServices.js";

const createUser = async (req, res) => {
    const userData = req.body;
    var result = await userServices.createUser(userData);
    return res.json(result);
};

const getProfileByToken = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Fount"));
    }
    var result = await userServices.getProfileByToken(userId);
    return res.json(result);
};

const getProfileById = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Fount"));
    }

    var result = await userServices.getProfileById(userId);
    return res.json(result);
};

const editUser = async (req, res) => {
    const userData = req.body;
    const userId = req.user.userId;
    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Fount"));
    }
    var result = await userServices.editUser(userId, userData);

    return res.json(result);
};

const resetPassword = async (req, res) => {
    const userData = req.body;
    const userId = req.user.userId;
    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Fount"));
    }
    var result = await userServices.resetPassword(userId, userData);
    return res.json(result);
};

const uploadAvatar = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(404).json({ message: "User not found" });
    }

    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await userServices.uploadAvatar(userId, file.path);
    return res.json(result);
};

export default {
    createUser,
    getProfileByToken,
    getProfileById,
    editUser,
    resetPassword,
    uploadAvatar,
};
