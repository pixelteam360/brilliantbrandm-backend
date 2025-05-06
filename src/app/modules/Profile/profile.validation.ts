import { z } from "zod";

const MaritalStatusEnum = z.enum(["SINGLE", "MARRIED", "IN_RELATIONSHIP"]);

const CreateProfileValidationSchema = z.object({
  fullName: z.string(),
  image: z.any(),
  maritalStatus: MaritalStatusEnum,
  location: z.string(),
  flagType: z.enum(["RED", "GREEN", "YELLOW"]).optional(),
});

const ProfileReportSchema = z.object({
  message: z.string(),
});

const FlagValidationSchema = z.object({
  type: z.enum(["RED", "GREEN", "YELLOW"]),
});

export const ProfileValidation = {
  CreateProfileValidationSchema,
  ProfileReportSchema,
  FlagValidationSchema,
};
