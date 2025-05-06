import { z } from "zod";

const CreateReviewValidationSchema = z.object({
  message: z.string(),
  flag: z.enum(["RED", "YELLOW", "GREEN"]),
  profileId: z.string(),
});

const reviewReportSchema = z.object({
  message: z.string(),
  reviewId: z.string(),
});

export const ReviewValidation = {
  CreateReviewValidationSchema,
  reviewReportSchema
};
