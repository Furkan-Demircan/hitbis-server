import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import ComminityItem from "../models/GroupItem.js";
import { GroupInfoDto } from "../dto/groupDtos.js";

const createGroup = async (groupData, adminId) => {
  try {
    const isGroupExists = await GroupModel.findOne({
      name: groupData.name,
    });

    const isUserIngroup = await ComminityItem.findOne({ userId: adminId });

    if (isUserIngroup) {
      return new ErrorResponse(401, "User is already in group");
    }

    if (isGroupExists) {
      return new ErrorResponse(401, "Group name already use");
    }

    var createResult = await GroupModel.create(groupData);
    var addAdmin = await ComminityItem.create({
      groupId: createResult._id,
      userId: adminId,
      isAdmin: true,
    });

    console.log(addAdmin);
    return new SuccessResponse(addAdmin, "Group create succesfully", null);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getAllGroup = async () => {
  try {
    const communities = await GroupModel.find();
    if (!communities) {
      return new ErrorResponse(404, "Group not found");
    }

    return new SuccessResponse(communities, null, communities.length);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getGroupById = async (groupId) => {
  const group = await GroupModel.findOne({ _id: groupId }).populate([
    "country",
    "city",
  ]);
  if (!group) {
    return new ErrorResponse(404, "Group not found");
  }

  const groupData = new GroupInfoDto(
    group._id,
    group.name,
    group.description,
    group.isPublic,
    // @ts-ignore
    group.country,
    // @ts-ignore
    group.city
  );

  return new SuccessResponse(groupData, null, null);
};

const addUserToGroup = async (groupId, userId) => {
  try {
    const group = await GroupModel.findOne({ _id: groupId });
    const user = await ComminityItem.findOne({ userId: userId });

    if (user) {
      return new ErrorResponse(401, "User is already in group");
    }

    if (!group) {
      return new ErrorResponse(404, "Group not found");
    }

    var addResult = await ComminityItem.create({
      groupId: groupId,
      userId: userId,
    });
    return new SuccessResponse(addResult, "User added to group", null);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const getUsersInGroup = async (groupId) => {
  try {
    const users = await ComminityItem.find({ groupId: groupId });
    if (!users) {
      return new ErrorResponse(404, "Users not found");
    }

    return new SuccessResponse(users, null, users.length);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};
export default {
  createGroup,
  getAllGroup,
  getGroupById,
  addUserToGroup,
  getUsersInGroup,
};
