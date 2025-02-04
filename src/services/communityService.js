import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import CommunityModel from "../models/CommunityModel.js";

const createCommunity = async (communityData) => {
	try {
		const isCommunityExists = await CommunityModel.findOne({ name: communityData.name });
		if (isCommunityExists) {
			return new ErrorResponse(401, "Community name already use");
		}

		await CommunityModel.create(communityData);
		return new SuccessResponse(true, "Community create succesfully", null);
	} catch {
		return new ErrorResponse(500, "Something went wrong");
	}
};

export default {
	createCommunity,
};
