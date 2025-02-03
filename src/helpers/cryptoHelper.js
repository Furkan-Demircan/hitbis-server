import bcrypt from "bcrypt";

const hashPassword = async (password) => {
	const hashedPassword = bcrypt.hash(password, 3);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	const match = await bcrypt.compare(password, hashedPassword);
	return match;
};

export default { hashPassword, comparePassword };
