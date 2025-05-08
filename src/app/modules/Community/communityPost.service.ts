import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import {
  TCommunityPost,
  TCommunityPosttFilterRequest,
} from "./communityPost.interface";
import { CommunityPosttSearchAbleFields } from "./communityPost.costant";

const createCommunityPostIntoDb = async (
  payload: TCommunityPost,
  imageFiles: any,
  userId: string
) => {
  const result = await prisma.$transaction(async (prisma) => {
    const imagesUrls = await Promise.all(
      imageFiles.images.map(
        async (image: any) =>
          (
            await fileUploader.uploadToCloudinary(image)
          ).Location
      )
    );
    const createPost = await prisma.communityPost.create({
      data: { ...payload, userId, images: imagesUrls },
    });

    return createPost;
  });

  return result;
};

const getCommunityPostsFromDb = async (
  params: TCommunityPosttFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.CommunityPostWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: CommunityPosttSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.CommunityPostWhereInput = { AND: andCondions };

  const result = await prisma.communityPost.findMany({
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
      message: true,
      images: true,
      user: {
        select: {
          fullName: true,
          image: true,
        },
      },
    },
  });
  const total = await prisma.communityPost.count({
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

export const CommunityPostService = {
  createCommunityPostIntoDb,
  getCommunityPostsFromDb,
};
