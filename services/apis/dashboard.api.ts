import { Api } from "./api";
import { GetDashboardResponse } from "@/types/dashboard";

export const getDashboardApi = async () => {
  const res = await Api.get<GetDashboardResponse>("/admin/dashboard/", true);
  return res;
};
