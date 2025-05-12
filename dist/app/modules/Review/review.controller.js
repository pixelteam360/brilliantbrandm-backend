"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.createReviewIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Review Created successfully!",
        data: result,
    });
}));
const getReviewsFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.getReviewsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Reviews retrieve successfully!",
        data: result,
    });
}));
const getSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.getSingleReview(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review retrieved successfully",
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.deleteReview(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review deleted successfully",
        data: result,
    });
}));
const reportReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.reportReview(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review Reported successfully",
        data: result,
    });
}));
const getAllReviewReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.getAllReviewReport();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review Report retrieve successfully",
        data: result,
    });
}));
exports.ReviewController = {
    createReview,
    getReviewsFromDb,
    getSingleReview,
    deleteReview,
    reportReview,
    getAllReviewReport,
};
