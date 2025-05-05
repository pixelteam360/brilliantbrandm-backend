import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProfileValidation } from "./profile.validation";
import { ProfileController } from "./profile.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(ProfileController.getProfiles)
  .post(
    auth(UserRole.USER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(ProfileValidation.CreateProfileValidationSchema),
    ProfileController.createProfile
  );

router.route("/:id").get(ProfileController.getMyProfile);

export const ProfileRoutes = router;
