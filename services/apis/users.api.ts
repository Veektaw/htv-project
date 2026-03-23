import { User } from "@/types/auth";
import { Api } from "./api";
import {
  CreateUserPayload,
  CreateUserResponse,
  GetUsersParams,
  GetUsersResponse,
} from "@/types/users";

export const getUsersApi = ({ search, page = "1", role }: GetUsersParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (search) params.keyword = search;

  if (role) params.role = role;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/users/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetUsersResponse>(url, true);
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

export const getUserApi = (userId: string) => {
  return Api.get<User>(`/admin/users/${userId}/`, true);
};
