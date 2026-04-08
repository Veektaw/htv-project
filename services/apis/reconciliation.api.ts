import { Api } from "./api";
import {
  GetDoctorReconciliation,
  GetDoctorReconciliationParams,
} from "@/types/reconciliation";

export const getDoctorReconciliationApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetDoctorReconciliationParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform) params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/reconciliations/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorReconciliation>(url, true);
};
