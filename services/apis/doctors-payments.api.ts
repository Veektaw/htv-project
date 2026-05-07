import { Api } from "./api";
import {
  GetDoctorPayments,
  GetDoctorPaymentsParams,
} from "@/types/doctors-payments";

export const getDoctorPaymentsApi = ({
  page = "1",
  limit = "10",
  sort_by,
  sort_order,
}: GetDoctorPaymentsParams) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  if (sort_by) params.sort_by = sort_by;
  if (sort_order) params.sort_order = sort_order;

  const queryString = new URLSearchParams(params).toString();

  const url = `/doctor/payments/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorPayments>(url, true);
};
