import { User } from "./auth";

export type GetUsersResponse = {
  total: number;
  page: number;
  limit: number;
  users: User[];
};
