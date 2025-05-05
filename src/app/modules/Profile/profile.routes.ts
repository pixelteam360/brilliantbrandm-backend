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

router
  .route("/report")
  .get(auth(UserRole.ADMIN), ProfileController.getAllReport);

router
  .route("/report/:id")
  .post(
    auth(UserRole.USER),
    validateRequest(ProfileValidation.ProfileReportSchema),
    ProfileController.reportProfile
  );

router
  .route("/:id")
  .get(ProfileController.getSingleProfile)
  .delete(auth(UserRole.ADMIN), ProfileController.deleteProfile);

export const ProfileRoutes = router;
