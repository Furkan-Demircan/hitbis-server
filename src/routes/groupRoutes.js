import { Router } from "express";
import groupController from "../controllers/groupController.js";
import { validator } from "../middlewares/validator.js";
import {
    createGroupValidation,
    updateGroupValidation,
} from "../validations/groupValidations.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const groupRoutes = Router();

groupRoutes.post(
    "/create",
    authenticateMiddleware,
    validator(createGroupValidation),
    groupController.createGroup
);
groupRoutes.get("/all", groupController.getAllGroup);
groupRoutes.get("/group", groupController.getGroupById);
groupRoutes.post("/join", authenticateMiddleware, groupController.joinGroup);
groupRoutes.get("/getusers", groupController.getUsersInGroup);
groupRoutes.get("/usercount", groupController.getGroupMemberCount);
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
groupRoutes.get("/my", authenticateMiddleware, groupController.getMyGroup);
groupRoutes.put(
    "/promote",
    authenticateMiddleware,
    groupController.promoteToAdmin
);

groupRoutes.put(
    "/update",
    validator(updateGroupValidation),
    authenticateMiddleware,
    groupController.updateGroup
);

groupRoutes.get("/search", groupController.searchGroups);

groupRoutes.get("/find", authenticateMiddleware, groupController.findUserGroup);

groupRoutes.get("/ismember", authenticateMiddleware, groupController.isMember);

groupRoutes.get("/isadmin", authenticateMiddleware, groupController.isAdmin);
export default groupRoutes;
