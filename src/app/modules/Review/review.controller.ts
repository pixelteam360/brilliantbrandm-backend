import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReviewIntoDb(req.body, req.user.id);
  sendResponse(res, {
    message: "Review Created successfully!",
    data: result,
  });
});

const getReviewsFromDb = catchAsync(async (req, res) => {
  const result = await ReviewService.getReviewsFromDb();
  sendResponse(res, {
    message: "Reviews retrieve successfully!",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const result = await ReviewService.getSingleReview(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review retrieved successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const result = await ReviewService.deleteReview(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review deleted successfully",
    data: result,
  });
});

const reportReview = catchAsync(async (req, res) => {
  const result = await ReviewService.reportReview(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review Reported successfully",
    data: result,
  });
});

const getAllReviewReport = catchAsync(async (req, res) => {
  
  const result = await ReviewService.getAllReviewReport();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review Report retrieve successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsFromDb,
  getSingleReview,
  deleteReview,
  reportReview,
  getAllReviewReport,
};
