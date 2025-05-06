"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router
    .route("/")
    .get(user_controller_1.userController.getUsers)
    .post((0, validateRequest_1.default)(user_validation_1.UserValidation.CreateUserValidationSchema), user_controller_1.userController.createUser);
router
    .route("/profile")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.getMyProfile)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.userUpdateSchema), user_controller_1.userController.updateProfile);
exports.UserRoutes = router;
