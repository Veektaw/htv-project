import z from "zod";

export const updateUserProfileFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  title: z.string().nonempty("Title is required"),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  phone: z.string(),
  company_name: z.string(),
  residential_address: z.string(),
});

export type UpdateUserProfileSchemaType = z.infer<
  typeof updateUserProfileFormSchema
>;
