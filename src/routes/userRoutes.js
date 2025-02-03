import { Router } from "express";
import userController from "../controllers/userController.js";
import { createUserValidation } from "../validations/userValidations.js";
import { validator } from "../middlewares/validator.js";

const userRoutes = Router();

userRoutes.post("/register", validator(createUserValidation), userController.createUser);

export default userRoutes;
