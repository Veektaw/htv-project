"use server";

import { logout, setCookie } from "../auth";
import { resetPasswordApi, signInApi } from "../apis/auth.api";
import { ResetPasswordPayload, SignInPayload } from "@/types/auth";

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

export const resetPasswordAction = async (data: ResetPasswordPayload) => {
  const response = await resetPasswordApi(data);

  console.log({ response: response.body });

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

export const logoutAction = async () => {
  await logout();
};
