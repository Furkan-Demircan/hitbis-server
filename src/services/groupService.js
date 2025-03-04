import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import groupItem from "../models/GroupItemModel.js";
import { GroupInfoDto } from "../dto/groupDtos.js";
import { ProfileInfoDto } from "../dto/userDtos.js";
import GroupItemModel from "../models/GroupItemModel.js";

const createGroup = async (groupData, adminId) => {
  try {
    const isGroupExists = await GroupModel.findOne({
      name: groupData.name,
    });

    const isUserIngroup = await groupItem.findOne({ userId: adminId });

    if (isUserIngroup) {
      return new ErrorResponse(401, "User is already in group");
    }

    if (isGroupExists) {
      return new ErrorResponse(401, "Group name already use");
    }

    var createResult = await GroupModel.create(groupData);
    var addAdmin = await groupItem.create({
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

const joinGroup = async (groupId, userId) => {
  try {
    const group = await GroupModel.findOne({ _id: groupId });
    const user = await groupItem.findOne({ userId: userId });

    if (user) {
      return new ErrorResponse(401, "User is already in group");
    }

    if (!group) {
      return new ErrorResponse(404, "Group not found");
    }

    var addResult = await groupItem.create({
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
    const members = await groupItem
      .find({ groupId: groupId })
      .populate("userId");
    if (!members) {
      return new ErrorResponse(404, "Users not found");
    }

    const users = [];
    members.map((member) => {
      const userInfo = new ProfileInfoDto(
        member.userId._id,
        member.userId.name,
        member.userId.surname,
        member.userId.username
      );
      users.push(userInfo);
    });

    console.log(users);

    return new SuccessResponse(users, null, users.length);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const leaveGroup = async (groupId, userId) => {
  try {
    const user = await groupItem.findOne({ groupId: groupId, userId: userId });

    if (!user) {
      return new ErrorResponse(404, "User not found in group");
    }

    var deleteResult = await groupItem
      .findOneAndDelete({ groupId: groupId, userId: userId })
      .exec();

    return new SuccessResponse(deleteResult, "User leave group", null);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

const deleteUser = async (groupId, adminId, userId) => {
  try {
    const existingAdmin = await GroupItemModel.findOne({
      groupId: groupId,
      userId: adminId,
      isAdmin: true,
    });

    if (!existingAdmin) {
      return new ErrorResponse(401, "You do not have permission");
    }

    const user = await groupItem.findOne({ groupId: groupId, userId: userId });

    if (!user) {
      return new ErrorResponse(404, "User not found in group");
    }

    var deleteResult = await groupItem
      .findOneAndDelete({ groupId: groupId, userId: userId })
      .exec();

    return new SuccessResponse(deleteResult, "User deleted from group", null);
  } catch {
    return new ErrorResponse(500, "Something went wrong");
  }
};

export default {
  createGroup,
  getAllGroup,
  getGroupById,
  joinGroup,
  getUsersInGroup,
  leaveGroup,
  deleteUser,
};
