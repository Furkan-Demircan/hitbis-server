import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import GroupItemModel from "../models/GroupItemModel.js";
import { GroupInfoDto } from "../dto/groupDtos.js";
import { ProfileInfoDto } from "../dto/userDtos.js";

const createGroup = async (groupData, adminId) => {
    try {
        const isGroupExists = await GroupModel.findOne({
            name: groupData.name,
        });

        const isUserIngroup = await GroupItemModel.findOne({ userId: adminId });

        if (isUserIngroup) {
            return new ErrorResponse(401, "User is already in group");
        }

        if (isGroupExists) {
            return new ErrorResponse(401, "Group name is already in use");
        }

        var createResult = await GroupModel.create(groupData);
        var addAdmin = await GroupItemModel.create({
            groupId: createResult._id,
            userId: adminId,
            isAdmin: true,
        });

        return new SuccessResponse(
            addAdmin,
            "Group created successfully",
            null
        );
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

const getMyGroup = async (userId) => {
    try {
        const groupLink = await GroupItemModel.findOne({ userId });

        if (!groupLink) {
            return new ErrorResponse(404, "You are not in any group");
        }

        const group = await GroupModel.findById(groupLink.groupId).populate([
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
            group.country,
            group.city
        );

        return new SuccessResponse(groupData, "Your group retrieved", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
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
        const user = await GroupItemModel.findOne({ userId: userId });

        if (user) {
            return new ErrorResponse(401, "User is already in group");
        }

        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }

        var addResult = await GroupItemModel.create({
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
        const members = await GroupItemModel.find({
            groupId: groupId,
        }).populate("userId");
        if (!members) {
            return new ErrorResponse(404, "Users not found");
        }

        const users = [];
        members.map((member) => {
            const userInfo = new ProfileInfoDto(
                member.userId._id,
                member.userId.name,
                member.userId.surname,
                member.userId.avatar,
                member.isAdmin
            );
            users.push(userInfo);
        });

        return new SuccessResponse(users, null, users.length);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const leaveGroup = async (groupId, userId) => {
    try {
        const user = await GroupItemModel.findOne({
            groupId: groupId,
            userId: userId,
        });

        if (!user) {
            return new ErrorResponse(404, "User not found in group");
        }

        const isAdmin = await GroupItemModel.findOne({
            groupId: groupId,
            userId: userId,
            isAdmin: true,
        });

        if (isAdmin) {
            const adminCount = await GroupItemModel.countDocuments({
                groupId,
                role: "admin",
            });

            if (adminCount <= 1) {
                return new ErrorResponse(
                    403,
                    "Grubun tek yöneticisisiniz. Ayrılmadan önce başka bir kullanıcıyı yönetici yapmalısınız."
                );
            }
        }

        var deleteResult = await GroupItemModel.findOneAndDelete({
            groupId: groupId,
            userId: userId,
        }).exec();

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

        if (userId === adminId) {
            return new ErrorResponse(
                403,
                "You cannot remove yourself from the group"
            );
        }

        const user = await GroupItemModel.findOne({
            groupId: groupId,
            userId: userId,
        });

        if (!user) {
            return new ErrorResponse(404, "User not found in group");
        }

        var deleteResult = await GroupItemModel.findOneAndDelete({
            groupId: groupId,
            userId: userId,
        }).exec();

        return new SuccessResponse(
            deleteResult,
            "User deleted from group",
            null
        );
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

const promoteToAdmin = async (groupId, adminId, targetUserId) => {
    try {
        const requester = await GroupItemModel.findOne({
            groupId,
            userId: adminId,
            isAdmin: true,
        });

        if (!requester) {
            return new ErrorResponse(
                403,
                "You are not authorized to promote users"
            );
        }

        const target = await GroupItemModel.findOne({
            groupId,
            userId: targetUserId,
        });

        if (!target) {
            return new ErrorResponse(404, "Target user is not in the group");
        }

        if (target.isAdmin) {
            return new ErrorResponse(400, "User is already an admin");
        }

        target.isAdmin = true;
        await target.save();

        return new SuccessResponse(target, "User promoted to admin", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const updateGroup = async (groupId, updateData, adminId) => {
    try {
        const isAdmin = await GroupItemModel.findOne({
            groupId,
            userId: adminId,
            isAdmin: true,
        });

        if (!isAdmin) {
            return new ErrorResponse(
                403,
                "You are not authorized to update the group"
            );
        }

        const group = await GroupModel.findById(groupId);
        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }

        await GroupModel.findByIdAndUpdate(groupId, {
            $set: updateData,
        });

        return new SuccessResponse(true, "Group updated successfully", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const searchGroups = async (keyword) => {
    try {
        if (!keyword || keyword.trim() === "") {
            return new ErrorResponse(400, "Search keyword is required");
        }

        const regex = new RegExp(keyword, "i");

        const results = await GroupModel.find({
            name: { $regex: regex },
        });

        if (!results || results.length === 0) {
            return new ErrorResponse(404, "No groups found");
        }

        return new SuccessResponse(
            results,
            "Search results retrieved",
            results.length
        );
    } catch (error) {
        return new ErrorResponse(500, "Failed to search groups", error);
    }
};

const getGroupMemberCount = async (groupId) => {
    try {
        const group = await GroupItemModel.find({
            groupId: groupId,
        });
        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }
        const memberCount = group.length;
        return new SuccessResponse(
            memberCount,
            "Group member count retrieved",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const findUserGroup = async (userId) => {
    try {
        const groupLink = await GroupItemModel.findOne({ userId });

        if (!groupLink) {
            return new SuccessResponse(null, "You are not in any group", null);
        }

        const group = await GroupModel.findById(groupLink.groupId).populate([
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
            group.city,
            group.imageUrl
        );

        return new SuccessResponse(groupData, "Your group retrieved", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const isMember = async (groupId, userId) => {
    try {
        const groupLink = await GroupItemModel.findOne({ userId, groupId });

        if (!groupLink) {
            return new SuccessResponse(
                false,
                "User is not a member of any group",
                null
            );
        }

        return new SuccessResponse(true, "User is a member of a group", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const isAdmin = async (groupId, userId) => {
    try {
        const groupLink = await GroupItemModel.findOne({
            userId,
            groupId,
            isAdmin: true,
        });

        if (!groupLink) {
            return new SuccessResponse(
                false,
                "User is not an admin of the group",
                null
            );
        }

        return new SuccessResponse(true, "User is an admin of the group", null);
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
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
    getMyGroup,
    promoteToAdmin,
    updateGroup,
    searchGroups,
    getGroupMemberCount,
    findUserGroup,
    isMember,
    isAdmin,
};
