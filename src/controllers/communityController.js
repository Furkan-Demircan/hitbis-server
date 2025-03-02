import { ErrorResponse } from "../helpers/responseHelper.js";
import communityService from "../services/communityService.js";

const createCommunity = async (req, res) => {
  const communityData = req.body;
  const adminId = req.user.userId;
  var result = await communityService.createCommunity(communityData, adminId);
  return res.json(result);
};

const getAllCommunity = async (req, res) => {
  var result = await communityService.getAllCommunity();
  return res.json(result);
};

const getCommunityById = async (req, res) => {
  const groupId = req.query.groupId;

  if (!groupId) {
    return res.json(new ErrorResponse(404, "Community not found"));
  }
  var result = await communityService.getCommunityById(groupId);
  return res.json(result);
};

const addUserToCommunity = async (req, res) => {
  const groupId = req.query.groupId;
  const userId = req.user.userId;

  if (!groupId) {
    return res.json(new ErrorResponse(404, "Community not found"));
  }

  var result = await communityService.addUserToCommunity(groupId, userId);
  return res.json(result);
};

const getUsersInCommunity = async (req, res) => {
  const groupId = req.query.groupId;

  if (!groupId) {
    return res.json(new ErrorResponse(404, "Community not found"));
  }

  var result = await communityService.getUsersInCommunity(groupId);
  return res.json(result);
};

export default {
  createCommunity,
  getAllCommunity,
  getCommunityById,
  addUserToCommunity,
  getUsersInCommunity,
};
