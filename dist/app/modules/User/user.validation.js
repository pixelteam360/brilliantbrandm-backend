"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const CreateUserValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    email: zod_1.z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
const UserLoginValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
const userUpdateSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
});
exports.UserValidation = {
    CreateUserValidationSchema,
    UserLoginValidationSchema,
    userUpdateSchema,
};
