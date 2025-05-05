import { z } from "zod";

export const MaritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "IN_RELATIONSHIP",
]);

const CreateProfileValidationSchema = z.object({
  fullName: z.string(),
  image: z.string(),
  maritalStatus: MaritalStatusEnum,
  location: z.string(),
  maritalVerifyCount: z.number().int().optional().default(0),
  redFlag: z.number().int().optional().default(0),
  yellowFlag: z.number().int().optional().default(0),
  greenFlag: z.number().int().optional().default(0),
});


export const ProfileValidation = {
  CreateProfileValidationSchema,
};
