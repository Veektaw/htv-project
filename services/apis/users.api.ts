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
