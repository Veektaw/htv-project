import z from "zod";

const ROLES = ["admin", "doctor"] as const;
export type Roles = (typeof ROLES)[number];

export const createUserFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  title: z.string().nonempty("Title is required"),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  phone: z.string(),
  role: z.enum(ROLES, {
    message: "Role is required",
  }),
});

export const updateUserDetailsFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  title: z.string(),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  phone: z.string(),
  role: z.enum(ROLES, {
    message: "Role is required",
  }),
  language_pref: z.string().nonempty("Language preference is required"),
  platforms: z.array(
    z.object({
      platform: z.string(),
      brand_partner: z.string(),
      external_user_id: z.string(),
    }),
  ),
  commissions: z.array(
    z.object({
      platform: z.string(),
      amount_per_prescription: z.string(),
      currency: z.string(),
      scheduled_appointments: z.boolean(),
      completed_appointments: z.boolean(),
      cancelled_appointments: z.boolean(),
      all_prescriptions: z.boolean(),
      signed_prescriptions: z.boolean(),
      cancelled_prescriptions: z.boolean(),
    }),
  ),
});

export type CreateUserSchemaType = z.infer<typeof createUserFormSchema>;
export type UpdateUserDetailsSchemaType = z.infer<
  typeof updateUserDetailsFormSchema
>;
