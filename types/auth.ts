export type Roles = "admin" | "doctor";

export type Permissions =
  | "create_user"
  | "update_user"
  | "deactivate_user"
  | "reactivate_user"
  | "view_all_users"
  | "view_user"
  | "view_all_doctors"
  | "run_doctor_reconciliation"
  | "view_all_pharmacies"
  | "run_pharmacy_reconciliation"
  | "view_all_brand_partners"
  | "run_brand_reconciliation"
  | "approve_invoices"
  | "send_accountant_requests"
  | "view_audit_logs"
  | "configure_settings"
  | "manage_api_integrations"
  | "view_all_tickets"
  | "respond_to_ticket"
  | "view_notifications"
  | "mark_notifications_read";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  title: string | null;
  phone: string | null;
  role: Roles;
  status: "active";
  must_change_password: boolean;
  language_pref: string;
  is_deactivated: boolean;
  last_login: string;
  failed_login_attempts: number;
  last_login_failed: string | null;
  created_at: string;
  updated_at: string;
  created_by: null;
  full_name: string;
  permissions: Permissions[];
};

export type SignInBody = {
  email: string;
  password: string;
};

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user: User;
  admin_profile: {
    is_super_admin: boolean;
  };
  creator_info: null;
};

export type UserDataAndAccessToken = {
  user: User;
  accessToken: string;
};

export type EncryptData = { data: UserDataAndAccessToken; expires: Date };

export type UserSession = {
  data: UserDataAndAccessToken;
  expires: Date;
  iat: number;
  exp: number;
};

// export type ResetPassword = {
//   email: string;
//   otp: string;
//   password: string;
// };

// export type AccessToken = { access_token: string };

export type ResetPasswordBody = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};
