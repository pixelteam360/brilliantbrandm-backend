import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { CommunityPostController } from "./communityPost.controller";
import { CommunityPostValidation } from "./communityPost.validation";

const router = express.Router();

router
  .route("/")
  .get(CommunityPostController.getCommunityPosts)
  .post(
    auth(UserRole.USER),
    fileUploader.uploadMultipleImage,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(
      CommunityPostValidation.CreateCommunityPostValidationSchema
    ),
    CommunityPostController.createCommunityPost
  );

export const CommunityPostRoutes = router;
