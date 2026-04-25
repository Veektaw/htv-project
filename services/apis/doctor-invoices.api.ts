import { Api } from "./api";
import {
  CreateManualInvoiceApiPayload,
  CreateManualInvoiceResponse,
  GetDoctorInvoices,
  GetDoctorInvoicesParams,
} from "@/types/invoices";

export const getDoctorInvoicesApi = ({
  page = "1",
  limit = "10",
  user_id,
  status,
}: GetDoctorInvoicesParams) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  if (user_id) params.user_id = user_id;
  if (status) params.status = status;

  const queryString = new URLSearchParams(params).toString();

  const url = `/doctor/invoices/${queryString ? `?${queryString}` : ""}`;

  return Api.get<GetDoctorInvoices>(url, true);
};

export const createManualInvoiceApi = (body: CreateManualInvoiceApiPayload) => {
  return Api.post<CreateManualInvoiceApiPayload, CreateManualInvoiceResponse>(
    "/doctor/invoices/",
    body,
    true,
  );
};

export const addDoctorCommentApi = (
  resourceId: string,
  message: string,
  resourceType: "invoice" | "reconciliation" = "invoice",
) => {
  const payload: Record<string, string> = {
    message,
  };

  if (resourceType === "invoice") {
    payload.invoice_id = resourceId;
  } else {
    payload.reconciliation_id = resourceId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Api.post<typeof payload, any>(`/doctor/comments/`, payload, true);
};

export const getDoctorCommentsApi = ({
  page = "1",
  limit = "10",
  invoice_id,
  reconciliation_id,
}: {
  page?: string;
  limit?: string;
  invoice_id?: string;
  reconciliation_id?: string;
}) => {
  const params: Record<string, string> = {
    page,
    limit,
  };

  if (invoice_id) params.invoice_id = invoice_id;
  if (reconciliation_id) params.reconciliation_id = reconciliation_id;

  const queryString = new URLSearchParams(params).toString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Api.get<any>(
    `/doctor/comments/${queryString ? `?${queryString}` : ""}`,
    true,
  );
};
