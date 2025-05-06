"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const review_validation_1 = require("./review.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(review_controller_1.ReviewController.getReviewsFromDb)
    .post((0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.CreateReviewValidationSchema), review_controller_1.ReviewController.createReview);
router
    .route("/reports")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN), review_controller_1.ReviewController.getAllReviewReport)
    .post((0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.reviewReportSchema), review_controller_1.ReviewController.reportReview);
router
    .route("/:id")
    .get(review_controller_1.ReviewController.getSingleReview)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN), review_controller_1.ReviewController.deleteReview);
// router.route("/report/:id");
exports.ReviewRoutes = router;
