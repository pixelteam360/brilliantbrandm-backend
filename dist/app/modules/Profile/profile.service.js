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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const profile_costant_1 = require("./profile.costant");
const fileUploader_1 = require("../../../helpars/fileUploader");
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const createProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
    });
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "User is blocked");
    }
    const { flagType } = payload, restData = __rest(payload, ["flagType"]);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let image = "";
        if (imageFile) {
            image = (yield fileUploader_1.fileUploader.uploadToCloudinary(imageFile)).Location;
        }
        const createProfile = yield prisma.profile.create({
            data: Object.assign(Object.assign({}, restData), { userId, image }),
            select: {
                id: true,
                fullName: true,
                image: true,
                maritalStatus: true,
                location: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
            },
        });
        if (flagType) {
            yield prisma.flag.create({
                data: {
                    profileId: createProfile.id,
                    userId,
                    type: flagType,
                },
            });
        }
        return createProfile;
    }));
    return result;
});
const getAllProfiles = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: profile_costant_1.profileSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const profiles = yield prisma_1.default.profile.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { isDeleted: false }),
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            fullName: true,
            image: true,
            maritalStatus: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
        },
    });
    const total = yield prisma_1.default.profile.count({
        where: Object.assign(Object.assign({}, whereConditons), { isDeleted: false }),
    });
    const profileIds = profiles.map((profile) => profile.id);
    const flagCount = yield prisma_1.default.review.groupBy({
        by: ["profileId", "flag"],
        where: {
            profileId: { in: profileIds },
            isDeleted: false,
        },
        _count: { flag: true },
    });
    const flagCountMap = {};
    profiles.forEach((profile) => {
        flagCountMap[profile.id] = { redFlag: 0, yellowFlag: 0, greenFlag: 0 };
    });
    flagCount.forEach((flag) => {
        if (flagCountMap[flag.profileId]) {
            if (flag.flag === "RED")
                flagCountMap[flag.profileId].redFlag = flag._count.flag;
            if (flag.flag === "GREEN")
                flagCountMap[flag.profileId].greenFlag = flag._count.flag;
            if (flag.flag === "YELLOW")
                flagCountMap[flag.profileId].yellowFlag = flag._count.flag;
        }
    });
    const verificationCounts = yield prisma_1.default.maritalVerification.groupBy({
        by: ["profileId"],
        where: {
            profileId: { in: profileIds },
        },
        _count: {
            _all: true,
        },
    });
    const verificationCountMap = {};
    profiles.forEach((profile) => {
        verificationCountMap[profile.id] = 0;
    });
    verificationCounts.forEach((verification) => {
        if (verification.profileId in verificationCountMap) {
            verificationCountMap[verification.profileId] = verification._count._all;
        }
    });
    const result = profiles.map((profile) => (Object.assign(Object.assign({}, profile), { flagCounts: flagCountMap[profile.id], maritalVerifyCount: verificationCountMap[profile.id] })));
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.profile.findUnique({
        where: { id, isDeleted: false },
        select: {
            id: true,
            fullName: true,
            image: true,
            maritalStatus: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            reviews: {
                where: { isDeleted: false },
                select: {
                    id: true,
                    flag: true,
                    message: true,
                },
            },
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    const maritalVerifyCount = yield prisma_1.default.maritalVerification.count({
        where: { profileId: id },
    });
    const flagCount = yield prisma_1.default.review.groupBy({
        by: ["flag"],
        where: { profileId: id, isDeleted: false },
        _count: { flag: true },
    });
    const counts = {
        redFlag: 0,
        yellowFlag: 0,
        greenFlag: 0,
    };
    flagCount.forEach((flag) => {
        if (flag.flag === "RED")
            counts.redFlag = flag._count.flag;
        if (flag.flag === "GREEN")
            counts.greenFlag = flag._count.flag;
        if (flag.flag === "YELLOW")
            counts.yellowFlag = flag._count.flag;
    });
    return Object.assign(Object.assign(Object.assign({}, result), counts), { maritalVerifyCount });
});
const getMyProfiles = (params, options, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: profile_costant_1.profileSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const result = yield prisma_1.default.profile.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { userId, isDeleted: false }),
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            fullName: true,
            image: true,
            maritalStatus: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
        },
    });
    const total = yield prisma_1.default.profile.count({
        where: Object.assign(Object.assign({}, whereConditons), { userId, isDeleted: false }),
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const reportProfile = (payload, id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.profile.findFirst({
        where: { id, isDeleted: false },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    const result = yield prisma_1.default.profileReport.create({
        data: Object.assign(Object.assign({}, payload), { profileId: id, reporterId: userId }),
    });
    return result;
});
const getAllReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.profileReport.findMany({
        select: {
            id: true,
            message: true,
            profileId: true,
            reporterId: true,
            profile: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const giveFlagToProfile = (flagType, userId, profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.profile.findFirst({
        where: { userId },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    const existingFlag = yield prisma_1.default.flag.findFirst({
        where: { userId, profileId },
    });
    if (existingFlag) {
        if (existingFlag.type === flagType.type) {
            yield prisma_1.default.flag.delete({
                where: { id: existingFlag.id },
            });
            return {
                message: `Removed ${flagType.type} flag from profile`,
                flagRemoved: true,
            };
        }
        else {
            yield prisma_1.default.flag.update({
                where: { id: existingFlag.id },
                data: { type: flagType.type },
            });
            return {
                message: `Changed flag to ${flagType.type} for profile`,
                flagUpdated: true,
            };
        }
    }
    else {
        yield prisma_1.default.flag.create({
            data: {
                profileId,
                userId,
                type: flagType.type,
            },
        });
        return {
            message: `Added ${flagType.type} flag to profile`,
            flagAdded: true,
        };
    }
});
const myGivenFlagToProfile = (profileId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flag.findFirst({
        where: { profileId, userId },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "You didn't give any flag");
    }
    return result;
});
const deleteProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.profile.findFirst({
        where: { id },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    const result = yield prisma_1.default.profile.update({
        where: { id },
        data: { isDeleted: true },
    });
    return {
        message: "Profile deleted successfully",
    };
});
const deleteProfileReport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profileReport = yield prisma_1.default.profileReport.findFirst({
        where: { id },
    });
    if (!profileReport) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Profile report not found");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteReview = yield prisma.profile.update({
            where: { id: profileReport.profileId },
            data: { isDeleted: true },
        });
        const deleteProfileReport = yield prisma.profileReport.delete({
            where: { id },
        });
    }));
    return {
        message: "Profile deleted successfully",
    };
});
const varifyMaritalStatus = (profileId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_1.default.profile.findFirst({
        where: { id: profileId, isDeleted: false },
    });
    if (!profile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    const existingVerification = yield prisma_1.default.maritalVerification.findFirst({
        where: {
            profileId,
            userId,
        },
    });
    if (existingVerification) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already verifyed the status");
    }
    yield prisma_1.default.maritalVerification.create({
        data: {
            profileId,
            userId,
        },
    });
    return {
        message: "Success marital status verification",
        verificationAdded: true,
    };
});
exports.ProfileService = {
    createProfile,
    getAllProfiles,
    getMyProfiles,
    getSingleProfile,
    reportProfile,
    getAllReport,
    giveFlagToProfile,
    myGivenFlagToProfile,
    deleteProfile,
    deleteProfileReport,
    varifyMaritalStatus,
};
