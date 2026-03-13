import { Api } from "./api";
import { ResetPasswordBody, SignInBody, SignInResponse } from "@/types/auth";

export const signInApi = (body: SignInBody) => {
  return Api.post<SignInBody, SignInResponse>("/auth/login/", body);
};

export const resetPasswordApi = (body: ResetPasswordBody) => {
  return Api.post<ResetPasswordBody, { message: string }>(
    "/auth/change-password/",
    body,
    true,
  );
};
