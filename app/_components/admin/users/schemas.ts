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

export type CreateUserSchemaType = z.infer<typeof createUserFormSchema>;
