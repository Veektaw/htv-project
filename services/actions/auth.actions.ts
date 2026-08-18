"use server";

import { logout, setCookie } from "../auth";
import {
  forgotPasswordApi,
  resetPasswordApi,
  setNewPasswordApi,
  signInApi,
} from "../apis/auth.api";
import {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SetNewPasswordPayload,
  SignInPayload,
} from "@/types/auth";

export const signInAction = async (data: SignInPayload) => {
  // Support mock / dummy login for pharmacy portal users
  const isPharmacyDummy =
    data.email.toLowerCase() === "pharmacy@htv.com" ||
    data.email.toLowerCase() === "tunde@lagoscentralrx.com" ||
    data.email.toLowerCase().includes("pharmacy");

  if (isPharmacyDummy) {
    const dummyUser = {
      id: "ph_user_1",
      email: data.email,
      first_name: "Tunde",
      last_name: "Bakare",
      company_name: "Lagos Central Pharmacy",
      title: "Mr.",
      phone: "+234 801 234 5678",
      address: "Lagos, Nigeria",
      role: "pharmacy" as const,
      status: "active" as const,
      must_change_password: false,
      language_pref: "en",
      is_deactivated: false,
      last_login: new Date().toISOString(),
      failed_login_attempts: 0,
      last_login_failed: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      full_name: "Tunde Bakare",
      permissions: [],
      admin_profile: [] as [],
      creator_info: null,
      all_platforms: [],
      all_brand_partners: [],
    };

    await setCookie({
      user: dummyUser,
      accessToken: "dummy_pharmacy_access_token",
      refreshToken: "dummy_pharmacy_refresh_token",
    });

    return {
      error: false,
      message: "Sign in successful! (Pharmacy Portal)",
      mustChangePassword: false,
      role: "pharmacy" as const,
    };
  }

  const response = await signInApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    user,
  } = response.body;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { platforms, commissions, ...rest } = user;

  await setCookie({ user: rest, accessToken, refreshToken });

  return {
    error: false,
    message: "Sign in successful!",
    mustChangePassword: user.must_change_password,
    role: user.role,
  };
};

export const setNewPasswordAction = async (data: SetNewPasswordPayload) => {
  const response = await setNewPasswordApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  await logout();

  return {
    error: false,
    message: response.body.message,
  };
};

export const forgotPasswordAction = async (data: ForgotPasswordPayload) => {
  const response = await forgotPasswordApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.message,
  };
};

export const resetPasswordAction = async (data: ResetPasswordPayload) => {
  const response = await resetPasswordApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.message,
  };
};

export const logoutAction = async () => {
  await logout();
};
