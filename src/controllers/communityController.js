import communityService from "../services/communityService.js";

const createCommunity = async (req, res) => {
	const communityData = req.body;
	var result = await communityService.createCommunity(communityData);
	return res.json(result);
};

export default { createCommunity };
