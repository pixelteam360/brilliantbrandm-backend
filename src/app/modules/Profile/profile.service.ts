import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, Profile } from "@prisma/client";
import { TProfile, TProfileFilterRequest } from "./profile.interface";
import { profileSearchAbleFields } from "./profile.costant";
import { fileUploader } from "../../../helpars/fileUploader";

const createProfile = async (payload: TProfile, imageFile: any, id: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createProfile = await prisma.profile.create({
      data: { ...payload, userId: id },
      select: {
        id: true,
        fullName: true,
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
    where: whereConditons,
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
      createdAt: true,
      updatedAt: true,
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

const getMyProfile = async (ProfileEmail: string) => {
  // const ProfileProfile = await prisma.profile.findUnique({
  //   where: {
  //     email: ProfileEmail,
  //   },
  //   select: {
  //     id: true,
  //     fullName: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });
  // return ProfileProfile;
};

export const ProfileService = {
  createProfile,
  getAllProfiles,
  getMyProfile,
};
