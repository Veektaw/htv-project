import { Api } from "./api";
import { GetInvoicesResponse, GetInvoicesParams } from "@/types/invoices";

export const getAdminInvoicesApi = ({
  page = "1",
  limit,
  doctor_id,
}: GetInvoicesParams = {}) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (doctor_id) params.doctor_id = doctor_id;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/invoices/${queryString ? `?${queryString}` : ""}`;// Debug log to check the URL being called
  return Api.get<GetInvoicesResponse>(url, true);
};