import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProfileService } from "./profile.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { profileFilterableFields } from "./profile.costant";

const createProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await ProfileService.createProfile(req.body, req.file, id);
  sendResponse(res, {
    message: "Profile Created successfully!",
    data: result,
  });
});

const getProfiles = catchAsync(async (req, res) => {
  const filters = pick(req.query, profileFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProfileService.getAllProfiles(filters, options);
  sendResponse(res, {
    message: "Profiles retrieve successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await ProfileService.getMyProfile(email);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Profile profile retrieved successfully",
    data: result,
  });
});

export const ProfileController = {
  createProfile,
  getProfiles,
  getMyProfile,
};
