import z from "zod";

export const updateUserProfileFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  title: z.string().nonempty("Title is required"),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  phone: z.string(),
  company_name: z.string(),
});

export type UpdateUserProfileSchemaType = z.infer<
  typeof updateUserProfileFormSchema
>;

export const advancedSettingsSchema = z
  .object({
    platforms: z.array(
      z.object({
        id: z.string(),
        platform: z.string().min(1, "Platform is required"),
        brand_partner: z.string().min(1, "Brand partner is required"),
        platform_account_recipient_email: z
          .string()
          .min(1, "Bill to email is required")
          .email("Enter a valid email address"),
        address: z.string().min(1, "Bill to address is required"),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const selectedPairs = new Map<string, number>();

    data.platforms.forEach((platform, index) => {
      if (!platform.platform || !platform.brand_partner) return;

      const pairKey = `${platform.platform}:${platform.brand_partner}`;
      const existingIndex = selectedPairs.get(pairKey);

      if (existingIndex === undefined) {
        selectedPairs.set(pairKey, index);
        return;
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This platform and brand partner pair already exists",
        path: ["platforms", index, "brand_partner"],
      });
    });
  });

export type AdvancedSettingsForm = z.infer<typeof advancedSettingsSchema>;
