import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    validateRequest(UserValidation.CreateUserValidationSchema),
    userController.createUser
  );

router
  .route("/profile")
  .get(auth(UserRole.ADMIN, UserRole.USER), userController.getMyProfile)
  .put(
    auth(UserRole.ADMIN, UserRole.USER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserValidation.userUpdateSchema),
    userController.updateProfile
  );

router.delete("/:id", auth(UserRole.ADMIN), userController.deleteUser);

router.get(
  "/admin-overview",
  auth(UserRole.ADMIN),
  userController.adminOverView
);

export const UserRoutes = router;
