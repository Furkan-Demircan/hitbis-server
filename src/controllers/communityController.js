import { ErrorResponse } from "../helpers/responseHelper.js";
import communityService from "../services/communityService.js";

const createCommunity = async (req, res) => {
  const communityData = req.body;
  var result = await communityService.createCommunity(communityData);
  return res.json(result);
};

const getAllCommunity = async (req, res) => {
  var result = await communityService.getAllCommunity();
  return res.json(result);
};

const getCommunityById = async (req, res) => {
  const communityId = req.query.communityId;

  if (!communityId) {
    return res.json(new ErrorResponse(404, "Community not found"));
  }
  var result = await communityService.getCommunityById(communityId);
  return res.json(result);
};

const addUserToCommunity = async (req, res) => {
  const communityId = req.query.communityId;
  const userId = req.user.userId;

  if (!communityId) {
    return res.json(new ErrorResponse(404, "Community not found"));
  }

  var result = await communityService.addUserToCommunity(communityId, userId);
  return res.json(result);
};

export default {
  createCommunity,
  getAllCommunity,
  getCommunityById,
  addUserToCommunity,
};
