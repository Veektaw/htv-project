import z from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
});

export const resetPasswordFormSchema = z.object({
  password: z.string().nonempty("New password is required"),
  confirm_password: z.string().nonempty("Password is required"),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordFormSchema>;
