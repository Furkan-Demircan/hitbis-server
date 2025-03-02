import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import CommunityModel from "../models/CommunityModel.js";
import ComminityItem from "../models/CommunityItem.js";
import { CommunityInfoDto } from "../dto/communityDtos.js";

const createCommunity = async (communityData, adminId) => {
  try {
    const isCommunityExists = await CommunityModel.findOne({
      name: communityData.name,
    });

    const isUserIncommunity = await ComminityItem.findOne({ userId: adminId });

    if (isUserIncommunity) {
      return new ErrorResponse(401, "User is already in community");
    }

    if (isCommunityExists) {
      return new ErrorResponse(401, "Community name already use");
    }

    var createResult = await CommunityModel.create(communityData);
    var addAdmin = await ComminityItem.create({
      communityId: createResult._id,
      userId: adminId,
      isAdmin: true,
    });

    console.log(addAdmin);
    return new SuccessResponse(addAdmin, "Community create succesfully", null);
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

const getCommunityById = async (groupId) => {
  const group = await CommunityModel.findOne({ _id: groupId }).populate([
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
  try {
    const group = await CommunityModel.findOne({ _id: communityId });
    const user = await ComminityItem.findOne({ userId: userId });

    if (user) {
      return new ErrorResponse(401, "User is already in community");
    }

    if (!group) {
      return new ErrorResponse(404, "Community not found");
    }

    var addResult = await ComminityItem.create({
      communityId: communityId,
      userId: userId,
    });
    return new SuccessResponse(addResult, "User added to group", null);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getUsersInCommunity = async (groupId) => {
  try {
    const users = await ComminityItem.find({ communityId: groupId });
    if (!users) {
      return new ErrorResponse(404, "Users not found");
    }

    return new SuccessResponse(users, null, users.length);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};
export default {
  createCommunity,
  getAllCommunity,
  getCommunityById,
  addUserToCommunity,
  getUsersInCommunity,
};
