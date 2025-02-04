import userServices from "../services/userServices.js";

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	var result = await userServices.loginUser(email, password);
	return res.json(result);
};

export default {
	loginUser,
};
