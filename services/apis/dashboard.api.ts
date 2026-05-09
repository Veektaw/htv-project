import { GetDashboardResponse } from "@/types/dashboard";
import { Api } from "./api";

export const getDashboardApi = async () => {
  const res = await Api.get<GetDashboardResponse>("/admin/dashboard/", true);
  return res;
};