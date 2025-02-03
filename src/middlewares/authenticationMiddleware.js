import jwt from "jsonwebtoken";
import { jwtOptions } from "../helpers/tokenHelper.js";

const authenticateMiddleware = async (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ isSuccess: false, status: 401, message: "Token not found" });
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, jwtOptions);
		console.log("decoded", decoded);
		if (!decoded) {
			return res.status(403).json({ isSuccess: false, status: 403, message: "Invalid token" });
		}
		req.user = decoded;
		next();
	} catch (err) {
		// console.log(err);
		return res.status(403).json({ isSuccess: false, status: 403, message: "Invalid token" });
	}
};

export default authenticateMiddleware;
