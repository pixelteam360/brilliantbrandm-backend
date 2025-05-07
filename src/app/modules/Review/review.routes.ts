import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { ReviewValidation } from "./review.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(ReviewController.getReviewsFromDb)
  .post(
    auth(UserRole.USER),
    validateRequest(ReviewValidation.CreateReviewValidationSchema),
    ReviewController.createReview
  );

router
  .route("/reports")
  .get(auth(UserRole.ADMIN), ReviewController.getAllReviewReport)
  .post(
    auth(UserRole.USER),
    validateRequest(ReviewValidation.reviewReportSchema),
    ReviewController.reportReview
  );

router
  .route("/:id")
  .get(ReviewController.getSingleReview)
  .delete(auth(UserRole.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;
