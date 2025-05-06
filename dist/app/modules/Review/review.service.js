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
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createReviewIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.profile.findFirst({
        where: { id: payload.profileId },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    const result = yield prisma_1.default.review.create({
        data: payload,
        select: {
            id: true,
            message: true,
            flag: true,
        },
    });
    return result;
});
const getReviewsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
        where: { isDeleted: false },
        select: {
            id: true,
            message: true,
            flag: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findFirst({
        where: { id, isDeleted: false },
        select: {
            id: true,
            message: true,
            flag: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.review.findFirst({
        where: { id },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const result = yield prisma_1.default.review.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { messate: "Review deleted successfully" };
});
const reportReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findFirst({
        where: { id: payload.reviewId },
    });
    if (!review) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const result = yield prisma_1.default.reviewReport.create({
        data: payload,
        select: {
            id: true,
            message: true,
            reviewId: true,
        },
    });
    return result;
});
const getAllReviewReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const reuslt = yield prisma_1.default.reviewReport.findMany({
        select: {
            id: true,
            message: true,
            reviewId: true,
            review: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return reuslt;
});
exports.ReviewService = {
    createReviewIntoDb,
    getReviewsFromDb,
    getSingleReview,
    deleteReview,
    reportReview,
    getAllReviewReport,
};
