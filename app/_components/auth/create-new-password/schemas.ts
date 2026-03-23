import z from "zod";

export const setNewPasswordFormSchema = z.object({
  old_password: z.string().nonempty("Old password is required"),
  new_password: z.string().nonempty("New password is required"),
  confirm_new_password: z.string().nonempty("Password is required"),
});

export type SetNewPasswordSchemaType = z.infer<typeof setNewPasswordFormSchema>;
