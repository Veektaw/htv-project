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

  await setCookie({ user, accessToken, refreshToken });

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
