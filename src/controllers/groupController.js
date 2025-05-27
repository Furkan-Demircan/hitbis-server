import { ErrorResponse } from "../helpers/responseHelper.js";
import groupService from "../services/groupService.js";

const createGroup = async (req, res) => {
    const groupData = req.body;
    const adminId = req.user.userId;
    var result = await groupService.createGroup(groupData, adminId);
    return res.json(result);
};

const getAllGroup = async (req, res) => {
    var result = await groupService.getAllGroup();
    return res.json(result);
};

const getGroupById = async (req, res) => {
    const groupId = req.query.groupId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }
    var result = await groupService.getGroupById(groupId);
    return res.json(result);
};

const joinGroup = async (req, res) => {
    const groupId = req.query.groupId;
    const userId = req.user.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.joinGroup(groupId, userId);
    return res.json(result);
};

const getUsersInGroup = async (req, res) => {
    const groupId = req.query.groupId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.getUsersInGroup(groupId);
    return res.json(result);
};

const leaveGroup = async (req, res) => {
    const groupId = req.query.groupId;
    const userId = req.user.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.leaveGroup(groupId, userId);
    return res.json(result);
};

const deleteUser = async (req, res) => {
    const groupId = req.query.groupId;
    const adminId = req.user.userId;
    const userId = req.query.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.deleteUser(groupId, adminId, userId);
    return res.json(result);
};

const getMyGroup = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User not found"));
    }

    var result = await groupService.getMyGroup(userId);
    return res.json(result);
};

const promoteToAdmin = async (req, res) => {
    const groupId = req.query.groupId;
    const adminId = req.user.userId;
    const userId = req.query.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.promoteToAdmin(groupId, adminId, userId);
    return res.json(result);
};

const updateGroup = async (req, res) => {
    const groupId = req.query.groupId;
    const groupData = req.body;
    const adminId = req.user.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.updateGroup(groupId, groupData, adminId);
    return res.json(result);
};

const searchGroups = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json(new ErrorResponse(404, "Query not found"));
    }

    var result = await groupService.searchGroups(q);
    return res.json(result);
};

const getGroupMemberCount = async (req, res) => {
    const groupId = req.query.groupId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.getGroupMemberCount(groupId);
    return res.json(result);
};

const findUserGroup = async (req, res) => {
    const userId = req.user.userId;

    var result = await groupService.findUserGroup(userId);
    return res.json(result);
};

const isMember = async (req, res) => {
    const groupId = req.query.groupId;
    const userId = req.user.userId;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await groupService.isMember(groupId, userId);
    return res.json(result);
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
};
