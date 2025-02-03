import jwt from "jsonwebtoken";

export const jwtOptions = {
	algorithm: "HS256",
	audience: "hitbis",
	issuer: "hitbis_app",
};

const createToken = async (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { ...jwtOptions, expiresIn: "4w" });
	return token;
};

export default {
	createToken,
};
