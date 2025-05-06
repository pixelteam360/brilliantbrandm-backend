import { z } from "zod";

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const otpValidationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z
    .number({ invalid_type_error: "OTP must be a 4-digit number." })
    .int()
    .gte(1000, { message: "OTP must be a 4-digit number." })
    .lte(9999, { message: "OTP must be a 4-digit number." }),
});

export const authValidation = {
  changePasswordValidationSchema,
  otpValidationSchema,
};
