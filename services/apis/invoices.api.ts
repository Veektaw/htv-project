import { Api } from "./api";
import { GetDoctorInvoices, GetDoctorInvoicesParams } from "@/types/invoices";

export const getDoctorInvoicesApi = ({
  page = "1",
  limit = "10",
  user_id,
}: GetDoctorInvoicesParams) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  if (user_id) params.user_id = user_id;

  const queryString = new URLSearchParams(params).toString();

  const url = `/doctor/invoices/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorInvoices>(url, true);
};

export const getAllInvoicesApi = ({
  page = "1",
  limit = "10",
  status,
}: GetDoctorInvoicesParams) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  if (status) params.status = status;

  const queryString = new URLSearchParams(params).toString();

  const url = `/admin/invoices/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorInvoices>(url, true);
};
