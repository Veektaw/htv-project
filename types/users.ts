import { Permissions, Roles, Status, User } from "./auth";

export type Pagination = {
  total: number;
  page: number;
  limit: number;
};

export type GetUsersResponse = Pagination & {
  users: User[];
};

export type CreateUserPayload = {
  email: string;
  first_name: string;
  last_name: string;
  title: string;
  phone: string;
  role: Roles;
};

export type CreateUserResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    title: string;
    phone: string;
    role: Roles;
    status: Status;
    must_change_password: boolean;
    language_pref: string;
    is_deactivated: boolean;
    last_login: string | null;
    failed_login_attempts: number;
    last_login_failed: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
    full_name: string;
    permissions: Permissions[];
    creator_info: [];
  };
  temp_password: string;
};
