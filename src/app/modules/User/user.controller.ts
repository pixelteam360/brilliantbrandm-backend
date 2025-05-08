import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDb(req.body);
  sendResponse(res, {
    message: "User Registered successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    message: "Users retrieve successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await userService.getMyProfile(email);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req?.user;

  const result = await userService.updateProfile(req.body, req.file, id);
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const adminOverView = catchAsync(async (req, res) => {
  const result = await userService.adminOverView();
  sendResponse(res, {
    message: "Overview data retrieve successfully!",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  getMyProfile,
  updateProfile,
  adminOverView,
};
