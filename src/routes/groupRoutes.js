import { Router } from "express";
import groupController from "../controllers/groupController.js";
import { validator } from "../middlewares/validator.js";
import { createGroupValidation } from "../validations/groupValidations.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const groupRoutes = Router();

groupRoutes.post(
  "/create",
  authenticateMiddleware,
  validator(createGroupValidation),
  groupController.createGroup
);
groupRoutes.get("/groups", groupController.getAllGroup);
groupRoutes.get("/group", groupController.getGroupById);
groupRoutes.post("/join", authenticateMiddleware, groupController.joinGroup);
groupRoutes.get("/getusers", groupController.getUsersInGroup);
groupRoutes.delete(
  "/leave",
  authenticateMiddleware,
  groupController.leaveGroup
);
groupRoutes.delete(
  "/deleteuser",
  authenticateMiddleware,
  groupController.deleteUser
);
export default groupRoutes;
