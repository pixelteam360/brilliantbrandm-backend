"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
const zod_1 = require("zod");
const MaritalStatusEnum = zod_1.z.enum(["SINGLE", "MARRIED", "IN_RELATIONSHIP"]);
const CreateProfileValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    image: zod_1.z.any(),
    maritalStatus: MaritalStatusEnum,
    location: zod_1.z.string(),
    flagType: zod_1.z.enum(["RED", "GREEN", "YELLOW"]).optional(),
});
const ProfileReportSchema = zod_1.z.object({
    message: zod_1.z.string(),
});
const FlagValidationSchema = zod_1.z.object({
    type: zod_1.z.enum(["RED", "GREEN", "YELLOW"]),
});
exports.ProfileValidation = {
    CreateProfileValidationSchema,
    ProfileReportSchema,
    FlagValidationSchema,
};
