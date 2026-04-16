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

export const createManualInvoiceApi = (
  body: CreateManualInvoiceApiPayload,
) => {
  return Api.post<CreateManualInvoiceApiPayload, CreateManualInvoiceResponse>(
    "/doctor/invoices/",
    body,
    true,
  );
};
