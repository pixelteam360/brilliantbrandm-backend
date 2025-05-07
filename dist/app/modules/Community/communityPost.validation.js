"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostValidation = void 0;
const zod_1 = require("zod");
const CreateCommunityPostValidationSchema = zod_1.z.object({
    message: zod_1.z.string(),
});
exports.CommunityPostValidation = {
    CreateCommunityPostValidationSchema,
};
