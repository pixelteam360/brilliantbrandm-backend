import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { TReview, TReviewReport } from "./review.interface";

const createReviewIntoDb = async (payload: TReview, userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (user?.isDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is blocked");
  }

  const profile = await prisma.profile.findFirst({
    where: { id: payload.profileId },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  const result = await prisma.review.create({
    data: payload,
    select: {
      id: true,
      message: true,
      flag: true,
    },
  });
  return result;
};

const getReviewsFromDb = async () => {
  const result = await prisma.review.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      message: true,
      flag: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getSingleReview = async (id: string) => {
  const result = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      message: true,
      flag: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

const deleteReview = async (id: string) => {
  const reviewReport = await prisma.reviewReport.findFirst({
    where: { id },
  });

  if (!reviewReport) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review Report not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const deleteReview = await prisma.review.update({
      where: { id: reviewReport.reviewId },
      data: { isDeleted: true },
    });

    const deleteReviewReport = await prisma.reviewReport.delete({
      where: { id },
    });
  });

  return { messate: "Review deleted successfully" };
};

const reportReview = async (payload: TReviewReport) => {
  const review = await prisma.review.findFirst({
    where: { id: payload.reviewId },
  });

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  const result = await prisma.reviewReport.create({
    data: payload,
    select: {
      id: true,
      message: true,
      reviewId: true,
    },
  });

  return result;
};

const getAllReviewReport = async () => {
  const reuslt = await prisma.reviewReport.findMany({
    select: {
      id: true,
      message: true,
      reviewId: true,
      review: {
        select: {
          message: true,
          profile: {
            select: {
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reuslt;
};

export const ReviewService = {
  createReviewIntoDb,
  getReviewsFromDb,
  getSingleReview,
  deleteReview,
  reportReview,
  getAllReviewReport,
};
