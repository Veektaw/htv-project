import { Api } from "./api";
import { GetUsersResponse } from "@/types/users";

export const getUsersApi = () => {
  return Api.get<GetUsersResponse>("/admin/users/", true);
};
