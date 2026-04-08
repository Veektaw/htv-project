import { Api } from "./api";
import {
  GetDoctorPrescriptions,
  GetDoctorPrescriptionsParams,
} from "@/types/prescriptions";

export const getDoctorPrescriptionsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetDoctorPrescriptionsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/doctor/prescriptions/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorPrescriptions>(url, true);
};

export const getAllPrescriptionsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetDoctorPrescriptionsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/prescriptions/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorPrescriptions>(url, true);
};
