import { Router } from "express";
import userController from "../controllers/userController.js";
import {
    createUserValidation,
    editUserValidation,
    resetPasswordValidation,
} from "../validations/userValidations.js";
import { validator } from "../middlewares/validator.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";
import upload from "../middlewares/cloudinaryMiddleware.js";

const userRoutes = Router();

userRoutes.post(
    "/register",
    validator(createUserValidation),
    userController.createUser
);
userRoutes.get(
    "/profile",
    authenticateMiddleware,
    userController.getProfileByToken
);
userRoutes.get("/profile/:userId", userController.getProfileById);
userRoutes.post(
    "/edit",
    validator(editUserValidation),
    authenticateMiddleware,
    userController.editUser
);
userRoutes.post(
    "/resetpassword",
    validator(resetPasswordValidation),
    authenticateMiddleware,
    userController.resetPassword
);
userRoutes.post(
    "/upload",
    authenticateMiddleware,
    upload.single("file"),
    userController.uploadAvatar
);

export default userRoutes;
