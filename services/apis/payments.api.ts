import { Api } from "./api";
import {
  GetAdminPayments,
  GetAdminPaymentsParams,
  CreatePaymentParams,
  DeletePaymentParams,
  AdminPayments,
} from "@/types/payments";
import { GetUsersResponse, GetUsersParams } from "@/types/users";
import { GetInvoicesResponse, GetInvoicesParams } from "@/types/invoices";

export const getAdminPaymentsApi = ({
  page = "1",
  limit,
  platform,
  start_date,
  end_date,
}: GetAdminPaymentsParams) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (platform && platform.toLowerCase() !== "all") params.platform = platform;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/payments/${queryString ? `?${queryString}` : ""}`;

  return Api.get<AdminPayments>(url, true);
};

export const getDoctorsApi = ({ search, page = "1", role = "doctor" }: Omit<GetUsersParams, "role"> & { role?: string } = {}) => {
  const params: Record<string, string> = {
    page,
    role,
  };

  if (search) params.keyword = search;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/users/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetUsersResponse>(url, true);
};

export const getInvoicesApi = ({ page = "1", limit, doctor_id }: GetInvoicesParams = {}) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (doctor_id) params.doctor_id = doctor_id;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/invoices/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetInvoicesResponse>(url, true);
};

export const createPaymentApi = (data: CreatePaymentParams) => {
  const { doctor_id, ...payload } = data;
  return Api.post<typeof payload, GetAdminPayments>(
    `/admin/payments/${doctor_id}/`,
    payload,
    true
  );
};

export const deletePaymentApi = ({ payment_id }: DeletePaymentParams) => {
  return Api.delete<null, { message: string }>(`/admin/payments/${payment_id}/`, null, true);
};
