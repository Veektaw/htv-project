import z from "zod";

const platformSchema = z.object({
  platform: z.string().nonempty("Platform is required"),
  bill_to_address: z.string().nonempty("Bill to address is required"),
  platform_account_recipient_email: z.string().nonempty("Recipient email is required").email("Invalid email"),
});
export const updateUserProfileFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  title: z.string().nonempty("Title is required"),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  phone: z.string(),
  company_name: z.string(),
   platforms: z.array(platformSchema).min(1, "At least one platform is required"),
  
});

export type UpdateUserProfileSchemaType = z.infer<
  typeof updateUserProfileFormSchema
>;
export type PlatformSchemaType = z.infer<typeof platformSchema>;