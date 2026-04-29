import { Permissions, Roles, Status, User } from "./auth";

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  total_page: number;
};

export type GetUsersParams = {
  search?: string;
  page?: string;
  role?: string;
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
  address: string;
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

export type UpdateUserDetailsPayload = {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  title: string;
  phone: string;
  role: Roles;
  status: Status;
  language_pref: string;
  platforms: {
    platform: string;
    brand_partner: string;
    external_user_id: string;
    platform_account_recipient_email: string;
  }[];
  commissions: {
    platform: string;
    amount_per_prescription: number;
    currency: string;
    scheduled_appointments: boolean;
    completed_appointments: boolean;
    cancelled_appointments: boolean;
    all_prescriptions: boolean;
    signed_prescriptions: boolean;
    cancelled_prescriptions: boolean;
    declined_prescriptions: boolean;
    on_hold_prescriptions: boolean;
    approved_prescriptions: boolean;
  }[];
};

export type UpdateUserProfilePayload = {
  first_name: string;
  last_name: string;
  company_name: string;
  phone: string;
  title: string;
};
