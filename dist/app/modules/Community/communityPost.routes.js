"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const communityPost_controller_1 = require("./communityPost.controller");
const communityPost_validation_1 = require("./communityPost.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(communityPost_controller_1.CommunityPostController.getCommunityPosts)
    .post((0, auth_1.default)(client_1.UserRole.USER), fileUploader_1.fileUploader.uploadMultipleImage, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(communityPost_validation_1.CommunityPostValidation.CreateCommunityPostValidationSchema), communityPost_controller_1.CommunityPostController.createCommunityPost);
exports.CommunityPostRoutes = router;
