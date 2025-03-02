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

const addUserToGroup = async (req, res) => {
  const groupId = req.query.groupId;
  const userId = req.user.userId;

  if (!groupId) {
    return res.json(new ErrorResponse(404, "Group not found"));
  }

  var result = await groupService.addUserToGroup(groupId, userId);
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

export default {
  createGroup,
  getAllGroup,
  getGroupById,
  addUserToGroup,
  getUsersInGroup,
};
