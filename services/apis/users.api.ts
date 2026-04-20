import { Api } from "./api";
import { User } from "@/types/auth";
import {
  CreateUserPayload,
  CreateUserResponse,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserDetailsPayload,
  UpdateUserProfilePayload,
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

export const updateUserApi = (
  userId: string,
  body: Partial<UpdateUserDetailsPayload>,
) => {
  return Api.put<
    Partial<UpdateUserDetailsPayload>,
    { message: string; user: User }
  >(`/admin/users/${userId}/`, body, true);
};

export const updateUserProfileApi = (
  body: Partial<UpdateUserProfilePayload>,
) => {
  return Api.put<
    Partial<UpdateUserProfilePayload>,
    { message: string; user: User }
  >(`/auth/update-profile/`, body, true);
};
