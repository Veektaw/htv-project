import { Api } from "./api";
import {
  GetDoctorPayments,
  GetDoctorPaymentsParams,
} from "@/types/doctors-payments";

export const getDoctorPaymentsApi = ({
  page = "1",
  limit = "10",
}: GetDoctorPaymentsParams) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  const queryString = new URLSearchParams(params).toString();

  const url = `/doctor/payments/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorPayments>(url, true);
};
