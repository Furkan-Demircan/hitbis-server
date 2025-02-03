import userServices from "../services/userServices.js";

const createUser = async (req, res) => {
	const userData = req.body;
	var result = await userServices.createUser(userData);
	return res.status(200).json(result);
};

export default {
	createUser,
};
