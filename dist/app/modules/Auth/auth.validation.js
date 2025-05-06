"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const changePasswordValidationSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
});
const otpValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Please enter a valid email address." }),
    otp: zod_1.z
        .number({ invalid_type_error: "OTP must be a 5-digit number." })
        .int()
        .gte(10000, { message: "OTP must be a 5-digit number." })
        .lte(99999, { message: "OTP must be a 5-digit number." }),
});
exports.authValidation = {
    changePasswordValidationSchema,
    otpValidationSchema,
};
