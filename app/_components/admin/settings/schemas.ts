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


export const advancedSettingsSchema = z.object({
  platforms: z.array(
    z.object({
      id: z.string(),
      brand_partner: z.string().min(1, "Brand partner is required"),
      address: z.string().min(1, "Bill to address is required"),
      platform_account_recipient_email: z
        .string()
        .min(1, "Bill to email is required")
        .email("Enter a valid email address"),
    }),
  ),
});

export type AdvancedSettingsForm = z.infer<typeof advancedSettingsSchema>;