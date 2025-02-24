import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import CommunityModel from "../models/CommunityModel.js";
import { CommunityInfoDto } from "../dto/communityDtos.js";

const createCommunity = async (communityData) => {
  try {
    const isCommunityExists = await CommunityModel.findOne({
      name: communityData.name,
    });
    if (isCommunityExists) {
      return new ErrorResponse(401, "Community name already use");
    }

    var createResult = await CommunityModel.create(communityData);
    return new SuccessResponse(
      createResult._id,
      "Community create succesfully",
      null
    );
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getAllCommunity = async () => {
  try {
    const communities = await CommunityModel.find();
    if (!communities) {
      return new ErrorResponse(404, "Community not found");
    }

    return new SuccessResponse(communities, null, communities.length);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getCommunityById = async (communityId) => {
  const group = await CommunityModel.findOne({ _id: communityId }).populate([
    "country",
    "city",
  ]);
  if (!group) {
    return new ErrorResponse(404, "Group not found");
  }

  const communityData = new CommunityInfoDto(
    group._id,
    group.name,
    group.description,
    group.isPublic,
    // @ts-ignore
    group.country,
    // @ts-ignore
    group.city
  );

  return new SuccessResponse(communityData, null, null);
};

const addUserToCommunity = async (communityId, userId) => {
  const group = await CommunityModel.findOne({ _id: communityId });
  if (!group) {
    return new ErrorResponse(404, "Community not found");
  }

  group.users.push(userId);
  await group.save();

  return new SuccessResponse(null, "User added to group", null);
};

export default {
  createCommunity,
  getAllCommunity,
  getCommunityById,
  addUserToCommunity,
};
