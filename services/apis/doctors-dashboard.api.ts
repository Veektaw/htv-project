import { Api } from "./api";

import {
  GetDashboardParams,
  GetDashboardResponse,
} from "@/types/doctors-dashboard";

export const getDashboardStatsApi = ({
  page = "1",
  limit = "10",
  sort_order = "desc",
}: GetDashboardParams = {}) => {
  const params: Record<string, string> = {
    page,
    limit,
    sort_order,
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/dashboard/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDashboardResponse>(url, true);
};
