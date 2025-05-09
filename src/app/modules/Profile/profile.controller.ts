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

const getMyProfiles = catchAsync(async (req, res) => {
  const filters = pick(req.query, profileFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProfileService.getMyProfiles(
    filters,
    options,
    req.user.id
  );
  sendResponse(res, {
    message: "Profiles retrieve successfully!",
    data: result,
  });
});

const getSingleProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.getSingleProfile(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Profile profile retrieved successfully",
    data: result,
  });
});

const reportProfile = catchAsync(async (req, res) => {
  console.log(req.user.id);
  const result = await ProfileService.reportProfile(
    req.body,
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Reported successfully",
    data: result,
  });
});

const getAllReport = catchAsync(async (req, res) => {
  const result = await ProfileService.getAllReport();
  sendResponse(res, {
    message: "Reports retrieve successfully!",
    data: result,
  });
});

const giveFlagToProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.giveFlagToProfile(
    req.body,
    req.user.id,
    req.params.id
  );
  sendResponse(res, {
    message: "Flag added successfully!",
    data: result,
  });
});

const myGivenFlagToProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.myGivenFlagToProfile(
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Flag added successfully!",
    data: result,
  });
});

const deleteProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.deleteProfile(req.params.id);
  sendResponse(res, {
    message: "Reports retrieve successfully!",
    data: result,
  });
});

const varifyMaritalStatus = catchAsync(async (req, res) => {
  const result = await ProfileService.varifyMaritalStatus(
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Success marital status verification",
    data: result,
  });
});

export const ProfileController = {
  createProfile,
  getProfiles,
  getMyProfiles,
  getSingleProfile,
  reportProfile,
  getAllReport,
  giveFlagToProfile,
  myGivenFlagToProfile,
  deleteProfile,
  varifyMaritalStatus,
};
