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
exports.ProfileController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const profile_service_1 = require("./profile.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const profile_costant_1 = require("./profile.costant");
const createProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield profile_service_1.ProfileService.createProfile(req.body, req.file, id);
    (0, sendResponse_1.default)(res, {
        message: "Profile Created successfully!",
        data: result,
    });
}));
const getProfiles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, profile_costant_1.profileFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield profile_service_1.ProfileService.getAllProfiles(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Profiles retrieve successfully!",
        data: result,
    });
}));
const getSingleProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.getSingleProfile(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Profile profile retrieved successfully",
        data: result,
    });
}));
const reportProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user.id);
    const result = yield profile_service_1.ProfileService.reportProfile(req.body, req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Reported successfully",
        data: result,
    });
}));
const getAllReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.getAllReport();
    (0, sendResponse_1.default)(res, {
        message: "Reports retrieve successfully!",
        data: result,
    });
}));
const giveFlagToProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.giveFlagToProfile(req.body, req.user.id, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Flag added successfully!",
        data: result,
    });
}));
const myGivenFlagToProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.myGivenFlagToProfile(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Flag added successfully!",
        data: result,
    });
}));
const deleteProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.deleteProfile(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Reports retrieve successfully!",
        data: result,
    });
}));
const varifyMaritalStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileService.varifyMaritalStatus(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Success marital status verification",
        data: result,
    });
}));
exports.ProfileController = {
    createProfile,
    getProfiles,
    getSingleProfile,
    reportProfile,
    getAllReport,
    giveFlagToProfile,
    myGivenFlagToProfile,
    deleteProfile,
    varifyMaritalStatus
};
