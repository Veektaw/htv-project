import { Api } from "./api";
import {
  GetDoctorReconciliations,
  GetDoctorReconciliationsParams,
} from "@/types/reconciliation";

export const getDoctorReconciliationsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetDoctorReconciliationsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform) params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/reconciliations/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorReconciliations>(url, true);
};

export const getAllReconciliationsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
  search,
}: GetDoctorReconciliationsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform) params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (search) params.keyword = search;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/reconciliation/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorReconciliations>(url, true);
};
