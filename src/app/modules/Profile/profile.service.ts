import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, Profile } from "@prisma/client";
import {
  TProfile,
  TProfileFilterRequest,
  TProfileReport,
} from "./profile.interface";
import { profileSearchAbleFields } from "./profile.costant";
import { fileUploader } from "../../../helpars/fileUploader";
import httpStatus from "http-status";

const createProfile = async (payload: TProfile, imageFile: any, id: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createProfile = await prisma.profile.create({
      data: { ...payload, userId: id, image },
      select: {
        id: true,
        fullName: true,
        image: true,
        maritalStatus: true,
        location: true,
        maritalVerifyCount: true,
        redFlag: true,
        greenFlag: true,
        yellowFlag: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

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

  const result = await prisma.profile.findMany({
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
      maritalVerifyCount: true,
      redFlag: true,
      greenFlag: true,
      yellowFlag: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
  // const total = await prisma.profile.count({
  //   where: whereConditons,
  // });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active Profiles found");
  }
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
      maritalVerifyCount: true,
      redFlag: true,
      greenFlag: true,
      yellowFlag: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      reviews: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }
  return result;
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

const updateProfile = async (payload: Partial<TProfile>, id: string) => {
  const profile = await prisma.profile.findFirst({
    where: { id },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  const result = await prisma.profile.update({
    where: { id },
    data: payload,
  });

  return {
    message: "Profile deleted successfully",
  };
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

export const ProfileService = {
  createProfile,
  getAllProfiles,
  getSingleProfile,
  reportProfile,
  getAllReport,
  deleteProfile,
};
