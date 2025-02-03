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

export default {
	createUser,
	getProfileByToken,
	editUser,
	resetPassword,
};
