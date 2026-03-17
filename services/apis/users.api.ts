import { User } from "@/types/auth";
import { Api } from "./api";
import {
  CreateUserPayload,
  CreateUserResponse,
  GetUsersResponse,
} from "@/types/users";

export const getUsersApi = () => {
  return Api.get<GetUsersResponse>("/admin/users/", true);
};

export const createUserApi = (body: CreateUserPayload) => {
  return Api.post<CreateUserPayload, CreateUserResponse>(
    "/admin/create-users/",
    body,
    true,
  );
};

export const deactivateUserApi = (userId: string) => {
  return Api.post<null, User>(`/admin/users/${userId}/`, null, true);
};

export const activateUserApi = (userId: string) => {
  return Api.post<null, User>(`/admin/${userId}/reactivate-users/`, null, true);
};
