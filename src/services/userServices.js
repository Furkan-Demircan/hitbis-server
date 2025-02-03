import tokenHelper from "../helpers/tokenHelper.js";
import UserModel from "../models/UserModel.js";
import cryptoHelper from "../helpers/cryptoHelper.js";

const createUser = async (userData) => {
	try {
		const isUserExists = await UserModel.findOne({
			$or: [{ username: userData.username }, { email: userData.email }],
		});

		if (isUserExists) {
			return { isSuccess: false, status: 409, message: "User already exists" };
		}

		userData.password = await cryptoHelper.hashPassword(userData.password);

		await UserModel.create(userData);
		return { isSuccess: true, status: 200, message: "User registered" };
	} catch (err) {
		console.log("Create User: err", err);
		return { isSuccess: false, status: 500, message: "Something went wrong" };
	}
};

const loginUser = async (email, password) => {
	const user = await UserModel.findOne({ email: email });

	if (!user) {
		return { isSuccess: false, status: 404, message: "Invalid email or password" };
	}
	const isPasswordCorrect = await cryptoHelper.comparePassword(password, user.password);
	if (!isPasswordCorrect) {
		return { isSuccess: false, status: 401, message: "Invalid email or password" };
	}

	const tokenModel = {
		id: user._id,
		username: user.username,
		email: user.email,
		isActive: user.isActive,
		role: "user",
		name: user.name,
		surname: user.surname,
	};

	const accessToken = await tokenHelper.createToken(tokenModel);

	return {
		isSuccess: true,
		status: 200,
		data: {
			accessToken,
			isSignUpComplete: user.isSignUpComplete,
		},
	};
};

export default {
	createUser,
	loginUser,
};
