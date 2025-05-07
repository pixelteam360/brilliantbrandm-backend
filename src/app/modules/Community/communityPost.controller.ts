import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { CommunityPostService } from "./communityPost.service";
import { CommunityPosttFilterableFields } from "./communityPost.costant";

const createCommunityPost = catchAsync(async (req, res) => {
  const result = await CommunityPostService.createCommunityPostIntoDb(
    req.body,
    req.files,
    req.user.id
  );
  sendResponse(res, {
    message: "Community Post uploded successfully!",
    data: result,
  });
});

const getCommunityPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, CommunityPosttFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await CommunityPostService.getCommunityPostsFromDb(
    filters,
    options
  );
  sendResponse(res, {
    message: "Community Posts retrieve successfully!",
    data: result,
  });
});

export const CommunityPostController = {
  createCommunityPost,
  getCommunityPosts,
};
