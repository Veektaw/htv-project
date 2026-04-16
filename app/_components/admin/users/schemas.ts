import z from "zod";

const ROLES = ["admin", "doctor"] as const;

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

const platformItemSchema = z.object({
  platform: z.string().optional(),
  brand_partner: z.string().optional(),
  external_user_id: z.string().optional(),
});

const commissionItemSchema = z.object({
  platform: z.string().optional(),
  amount_per_prescription: z.string().optional(),
  currency: z.string().optional(),
  scheduled_appointments: z.boolean().optional(),
  completed_appointments: z.boolean().optional(),
  cancelled_appointments: z.boolean().optional(),
  all_prescriptions: z.boolean().optional(),
  signed_prescriptions: z.boolean().optional(),
  cancelled_prescriptions: z.boolean().optional(),
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
  platforms: z.array(platformItemSchema).superRefine((platforms, ctx) => {
    const isMultiple = platforms.length > 1;

    platforms.forEach((item, index) => {
      const hasAnyValue =
        item.platform || item.brand_partner || item.external_user_id;

      // ✅ CASE 1: Only 1 row
      if (!isMultiple) {
        if (!hasAnyValue) return; // allow empty

        // ❌ partial → enforce all
        if (!item.platform) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Platform is required",
            path: [index, "platform"],
          });
        }

        if (!item.brand_partner) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Brand partner is required",
            path: [index, "brand_partner"],
          });
        }

        if (!item.external_user_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "User ID is required",
            path: [index, "external_user_id"],
          });
        }

        return;
      }

      // ✅ CASE 2: Multiple rows → ALL must be filled
      if (!item.platform) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Platform is required",
          path: [index, "platform"],
        });
      }

      if (!item.brand_partner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Brand partner is required",
          path: [index, "brand_partner"],
        });
      }

      if (!item.external_user_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "User ID is required",
          path: [index, "external_user_id"],
        });
      }
    });
  }),
  commissions: z.array(commissionItemSchema).superRefine((commissions, ctx) => {
    const isMultiple = commissions.length > 1;

    commissions.forEach((item, index) => {
      const hasAnyValue =
        item.platform ||
        item.amount_per_prescription ||
        // item.currency ||
        item.scheduled_appointments ||
        item.completed_appointments ||
        item.cancelled_appointments ||
        item.all_prescriptions ||
        item.signed_prescriptions ||
        item.cancelled_prescriptions;

      // ✅ CASE 1: Single row
      if (!isMultiple) {
        if (!hasAnyValue) return; // allow empty

        // ❌ require key fields
        if (!item.platform) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Platform is required",
            path: [index, "platform"],
          });
        }

        if (!item.amount_per_prescription) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount is required",
            path: [index, "amount_per_prescription"],
          });
        }

        // if (!item.currency) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Currency is required",
        //     path: [index, "currency"],
        //   });
        // }

        return;
      }

      // ✅ CASE 2: Multiple rows → ALL must be filled
      if (!item.platform) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Platform is required",
          path: [index, "platform"],
        });
      }

      if (!item.amount_per_prescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount is required",
          path: [index, "amount_per_prescription"],
        });
      }

      if (!item.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required",
          path: [index, "currency"],
        });
      }
    });
  }),
});

export type CreateUserSchemaType = z.infer<typeof createUserFormSchema>;
export type UpdateUserDetailsSchemaType = z.infer<
  typeof updateUserDetailsFormSchema
>;
