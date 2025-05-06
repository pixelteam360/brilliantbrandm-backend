import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { FlagType, Prisma, Profile } from "@prisma/client";
import {
  TProfile,
  TProfileFilterRequest,
  TProfileReport,
} from "./profile.interface";
import { profileSearchAbleFields } from "./profile.costant";
import { fileUploader } from "../../../helpars/fileUploader";
import httpStatus from "http-status";

const createProfile = async (
  payload: TProfile,
  imageFile: any,
  userId: string
) => {
  const { flagType, ...restData } = payload;

  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createProfile = await prisma.profile.create({
      data: { ...restData, userId, image },
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
      await prisma.flag.create({
        data: {
          profileId: createProfile.id,
          userId,
          type: flagType,
        },
      });
    }

    return createProfile;
  });

  return result;
};

const getAllProfiles = async (
  params: TProfileFilterRequest,
  options: IPaginationOptions
) => {
  // const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.ProfileWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: profileSearchAbleFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.ProfileWhereInput = { AND: andCondions };

  const profiles = await prisma.profile.findMany({
    where: { ...whereConditons, isDeleted: false },
    orderBy:
      options.sortBy && options.sortOrder
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
  // const total = await prisma.profile.count({
  //   where: whereConditons,
  // });

  if (!profiles || profiles.length === 0) {
    throw new ApiError(404, "No active Profiles found");
  }

  const profileIds = profiles.map((profile) => profile.id);

  const flagCount = await prisma.flag.groupBy({
    by: ["profileId", "type"],
    where: {
      profileId: { in: profileIds },
    },
    _count: { type: true },
  });

  const flagCountMap: Record<
    string,
    { redFlag: number; greenFlag: number; yellowFlag: number }
  > = {};

  profiles.forEach((profile) => {
    flagCountMap[profile.id] = { redFlag: 0, yellowFlag: 0, greenFlag: 0 };
  });

  flagCount.forEach((flag) => {
    if (flagCountMap[flag.profileId]) {
      if (flag.type === "RED")
        flagCountMap[flag.profileId].redFlag = flag._count.type;
      if (flag.type === "GREEN")
        flagCountMap[flag.profileId].greenFlag = flag._count.type;
      if (flag.type === "YELLOW")
        flagCountMap[flag.profileId].yellowFlag = flag._count.type;
    }
  });

  const result = profiles.map((profile) => ({
    ...profile,
    flagCounts: flagCountMap[profile.id],
  }));

  // return {
  //   meta: {
  //     page,
  //     limit,
  //     total,
  //   },
  //   data: result,
  // };

  return result;
};

const getSingleProfile = async (id: string) => {
  const result = await prisma.profile.findUnique({
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
      reviews: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  const maritalVerifyCount = await prisma.maritalVerification.count({
    where: { profileId: id },
  });

  const flagCount = await prisma.flag.groupBy({
    by: ["type"],
    where: { profileId: id },
    _count: { type: true },
  });

  const counts = {
    redFlag: 0,
    yellowFlag: 0,
    greenFlag: 0,
  };

  flagCount.forEach((flag) => {
    if (flag.type === "RED") counts.redFlag = flag._count.type;
    if (flag.type === "GREEN") counts.greenFlag = flag._count.type;
    if (flag.type === "YELLOW") counts.yellowFlag = flag._count.type;
  });

  return { ...result, ...counts, maritalVerifyCount };
};

const reportProfile = async (
  payload: TProfileReport,
  id: string,
  userId: string
) => {
  const profile = await prisma.profile.findFirst({
    where: { id, isDeleted: false },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  const result = await prisma.profileReport.create({
    data: { ...payload, profileId: id, reporterId: userId },
  });

  return result;
};

const getAllReport = async () => {
  const result = await prisma.profileReport.findMany({
    select: {
      id: true,
      message: true,
      profileId: true,
      reporterId: true,
      profile: true,
    },
  });

  return result;
};

const giveFlagToProfile = async (
  flagType: { type: FlagType },
  userId: string,
  profileId: string
) => {
  const profile = await prisma.profile.findFirst({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  const existingFlag = await prisma.flag.findFirst({
    where: { userId, profileId },
  });

  if (existingFlag) {
    if (existingFlag.type === flagType.type) {
      await prisma.flag.delete({
        where: { id: existingFlag.id },
      });
      return {
        message: `Removed ${flagType.type} flag from profile`,
        flagRemoved: true,
      };
    } else {
      await prisma.flag.update({
        where: { id: existingFlag.id },
        data: { type: flagType.type },
      });
      return {
        message: `Changed flag to ${flagType.type} for profile`,
        flagUpdated: true,
      };
    }
  } else {
    await prisma.flag.create({
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
};

const myGivenFlagToProfile = async (profileId: string, userId: string) => {
  const result = await prisma.flag.findFirst({
    where: { profileId, userId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "You didn't give any flag");
  }

  return result;
};

const deleteProfile = async (id: string) => {
  const profile = await prisma.profile.findFirst({
    where: { id },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  const result = await prisma.profile.update({
    where: { id },
    data: { isDeleted: true },
  });

  return {
    message: "Profile deleted successfully",
  };
};

const varifyMaritalStatus = async (profileId: string, userId: string) => {
  const profile = await prisma.profile.findFirst({
    where: { id: profileId, isDeleted: false },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  const existingVerification = await prisma.maritalVerification.findFirst({
    where: {
      profileId,
      userId,
    },
  });

  if (existingVerification) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already verifyed the status"
    );
  }

  await prisma.maritalVerification.create({
    data: {
      profileId,
      userId,
    },
  });
  return {
    message: "Success marital status verification",
    verificationAdded: true,
  };
};

export const ProfileService = {
  createProfile,
  getAllProfiles,
  getSingleProfile,
  reportProfile,
  getAllReport,
  giveFlagToProfile,
  myGivenFlagToProfile,
  deleteProfile,
  varifyMaritalStatus,
};
