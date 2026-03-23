import { Api } from "./api";
import {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SetNewPasswordPayload,
  SignInPayload,
  SignInResponse,
} from "@/types/auth";

export const signInApi = (body: SignInPayload) => {
  return Api.post<SignInPayload, SignInResponse>("/auth/login/", body);
};

export const setNewPasswordApi = (body: SetNewPasswordPayload) => {
  return Api.post<SetNewPasswordPayload, { message: string }>(
    "/auth/change-password/",
    body,
    true,
  );
};

export const forgotPasswordApi = (body: ForgotPasswordPayload) => {
  return Api.post<ForgotPasswordPayload, { message: string }>(
    "/auth/forgot-password/",
    body,
    true,
  );
};

export const resetPasswordApi = (body: ResetPasswordPayload) => {
  return Api.post<ResetPasswordPayload, { message: string }>(
    "/auth/reset-password/",
    body,
    true,
  );
};
