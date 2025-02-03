export const validator = (schema) => async (req, res, next) => {
	const result = await schema.safeParseAsync(req.body);
	if (result.success) {
		return next();
	}

	return res.json({ isSuccess: false, status: 400, message: "Validation failed" });
};
