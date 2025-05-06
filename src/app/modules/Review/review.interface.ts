import { FlagType } from "@prisma/client";

export type TReview = {
  id: string;
  message: string;
  flag: FlagType;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
};

export type TReviewReport = {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  reviewId: string;
};
