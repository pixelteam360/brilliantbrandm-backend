"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const CreateReviewValidationSchema = zod_1.z.object({
    message: zod_1.z.string(),
    flag: zod_1.z.enum(["RED", "YELLOW", "GREEN"]),
    profileId: zod_1.z.string(),
});
const reviewReportSchema = zod_1.z.object({
    message: zod_1.z.string(),
    reviewId: zod_1.z.string(),
});
exports.ReviewValidation = {
    CreateReviewValidationSchema,
    reviewReportSchema
};
