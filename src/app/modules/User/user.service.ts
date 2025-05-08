import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { fileUploader } from "../../../helpars/fileUploader";
import { IUserFilterRequest, TUser } from "./user.interface";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";

const createUserIntoDb = async (payload: TUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new ApiError(
        400,
        `User with this email ${payload.email} already exists`
      );
    }
  }
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const profileData = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: profileData.id,
      email: profileData.email,
      role: profileData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { ...profileData, token: accessToken };
};

const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
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
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfile = async (userEmail: string) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfile;
};

const updateProfile = async (payload: User, imageFile: any, userId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createUserProfile = await prisma.user.update({
      where: { id: userId },
      data: { ...payload, image },
    });

    return createUserProfile;
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
};
