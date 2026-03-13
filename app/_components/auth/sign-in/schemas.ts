import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});

export type LoginSchemaType = z.infer<typeof loginFormSchema>;
