import tokenHelper from "../helpers/tokenHelper.js";
import UserModel from "../models/UserModel.js";
import cryptoHelper from "../helpers/cryptoHelper.js";
import { ProfileInfoByTokenDto, ProfileInfoDto } from "../dto/userDtos.js";
import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";

const createUser = async (userData) => {
  try {
    const isUserExists = await UserModel.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (isUserExists) {
      return new ErrorResponse(409, "User already exists");
    }

    userData.password = await cryptoHelper.hashPassword(userData.password);

    await UserModel.create(userData);
    return new SuccessResponse(null, "User registered succesfully");
  } catch (err) {
    console.log("Create User: err", err);
    return new ErrorResponse(500, "Something went wrong.");
  }
};

const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return new ErrorResponse(404, "Invalid email or password");
  }
  const isPasswordCorrect = await cryptoHelper.comparePassword(
    password,
    user.password
  );
  if (!isPasswordCorrect) {
    return new ErrorResponse(404, "Invalid email or password");
  }

  const tokenModel = {
    userId: user._id,
    username: user.username,
    email: user.email,
    isActive: user.isActive,
    role: "user",
    name: user.name,
    surname: user.surname,
  };

  const accessToken = await tokenHelper.createToken(tokenModel);
  const data = { accessToken, isSignUpComplete: user.isSignUpComplete };
  return new SuccessResponse(data, undefined, null);
};

const getProfileByToken = async (userId) => {
  const user = await UserModel.findOne({ _id: userId });

  if (!user) {
    return new ErrorResponse(404, "User not found");
  }

  const userProfileData = new ProfileInfoByTokenDto(
    user._id,
    user.name,
    user.surname,
    user.username,
    user.email,
    user.birthDate,
    user.height,
    user.weight
  );

  return new SuccessResponse(userProfileData, null, null);
};

const getProfileById = async (userId) => {
  try {
    const user = await UserModel.findById({ _id: userId });

    if (!user) {
      return new ErrorResponse(404, "User Not Found");
    }

    const userProfileData = new ProfileInfoDto(
      user._id,
      user.name,
      user.surname,
      user.username
    );

    return new SuccessResponse(userProfileData, null, null);
  } catch (e) {
    console.log("e", e);
    return new ErrorResponse(500, "Something went wrong");
  }
};

const editUser = async (userId, userData) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return new ErrorResponse(404, "User not found");
    }

    if (userData.email) {
      const userCheck = await UserModel.findOne({ email: userData.email });
      if (userCheck && user.email !== userCheck.email) {
        return new ErrorResponse(409, `Email has exists`);
      }
    }

    if (userData.username) {
      const userCheck = await UserModel.findOne({
        username: userData.username,
      });
      if (userCheck && user.username !== userCheck.username) {
        return new ErrorResponse(409, `Username has exists`);
      }
    }

    await UserModel.updateOne({ _id: userId }, userData);

    return new SuccessResponse(true, null, null);
  } catch (e) {
    console.log("e", e);
    return new ErrorResponse(500, "Something went wrong");
  }
};

const resetPassword = async (userId, userData) => {
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return new ErrorResponse(404, "User not found");
  }

  try {
    const isPasswordCorrect = await cryptoHelper.comparePassword(
      userData.oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return new ErrorResponse(403, "Password is incorrect");
    }

    const hashPassword = await cryptoHelper.hashPassword(userData.newPassword);
    await UserModel.updateOne({ _id: userId }, { password: hashPassword });

    return new SuccessResponse(true, null, null);
  } catch (e) {
    console.log("e", e);
    return new ErrorResponse(500, "Something went wrong");
  }
};

export default {
  createUser,
  loginUser,
  getProfileByToken,
  getProfileById,
  editUser,
  resetPassword,
};
