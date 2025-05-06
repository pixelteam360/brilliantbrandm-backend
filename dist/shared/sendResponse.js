"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonData) => {
    res.status(jsonData.statusCode || 200).json({
        success: jsonData.success || true,
        message: jsonData.message,
        meta: jsonData.meta || null || undefined,
        data: jsonData.data || null || undefined,
    });
};
exports.default = sendResponse;
