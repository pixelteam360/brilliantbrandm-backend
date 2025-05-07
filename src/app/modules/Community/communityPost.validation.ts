import { z } from "zod";

const CreateCommunityPostValidationSchema = z.object({
  message: z.string(),
});


export const CommunityPostValidation = {
  CreateCommunityPostValidationSchema,
};
