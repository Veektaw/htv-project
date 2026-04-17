import { Api } from "./api";
import {
  GetInvoicesResponse,
  GetInvoicesParams,
  GetDoctorInvoices,
  GetDoctorInvoicesParams,
  Invoice,
} from "@/types/invoices";

export const getAdminInvoicesApi = ({
  page = "1",
  limit,
  doctor_id,
  search,
}: GetInvoicesParams = {}) => {
  const params: Record<string, string> = {
    page,
  };

  if (limit) params.limit = limit;
  if (doctor_id) params.doctor_id = doctor_id;
  if (search) params.keyword = search;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/invoices/${queryString ? `?${queryString}` : ""}`;
  return Api.get<GetInvoicesResponse>(url, true);
};

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

export const updateInvoiceStatusApi = (invoiceId: string, actionType: string, disputeMessage?: string) => {
  const payload: { action_type: string; dispute_message?: string } = {
    action_type: actionType,
  };
  if (disputeMessage) {
    payload.dispute_message = disputeMessage;
  }
  return Api.put<typeof payload, Invoice>(`/admin/invoices/${invoiceId}/`, payload, true);
};
