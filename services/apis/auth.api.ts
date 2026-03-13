import { Api } from "./api";
import {
  ResetPasswordPayload,
  SignInPayload,
  SignInResponse,
} from "@/types/auth";

export const signInApi = (body: SignInPayload) => {
  return Api.post<SignInPayload, SignInResponse>("/auth/login/", body);
};

export const resetPasswordApi = (body: ResetPasswordPayload) => {
  return Api.post<ResetPasswordPayload, { message: string }>(
    "/auth/change-password/",
    body,
    true,
  );
};
