"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const profile_validation_1 = require("./profile.validation");
const profile_controller_1 = require("./profile.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(profile_controller_1.ProfileController.getProfiles)
    .post((0, auth_1.default)(client_1.UserRole.USER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(profile_validation_1.ProfileValidation.CreateProfileValidationSchema), profile_controller_1.ProfileController.createProfile);
router
    .route("/report")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN), profile_controller_1.ProfileController.getAllReport);
router
    .route("/report/:id")
    .post((0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(profile_validation_1.ProfileValidation.ProfileReportSchema), profile_controller_1.ProfileController.reportProfile);
router
    .route("/:id")
    .get(profile_controller_1.ProfileController.getSingleProfile)
    .patch((0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(profile_validation_1.ProfileValidation.FlagValidationSchema), profile_controller_1.ProfileController.giveFlagToProfile)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN), profile_controller_1.ProfileController.deleteProfile);
router.get("/my-given-flag/:id", (0, auth_1.default)(client_1.UserRole.USER), profile_controller_1.ProfileController.myGivenFlagToProfile);
router.post("/marital-status-varification/:id", (0, auth_1.default)(client_1.UserRole.USER), profile_controller_1.ProfileController.varifyMaritalStatus);
exports.ProfileRoutes = router;
