import { User } from "./auth";
import { Pagination } from "./users";

export type GetDoctorInvoicesParams = {
  page?: string;
  limit?: string;
  user_id?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  status?: string;
};

export type CreateManualInvoicePayload = {
  userId: string;
  invoiceId: string;
  dateTime: string;
};

export type CreateManualInvoiceApiPayload = {
  user_id: string;
  invoice_id: string;
  date_time: string;
};

export type CreateManualInvoiceResponse = {
  message: string;
};

export type InvoiceStatus = "Paid" | "Under review" | "Dispute Invoice";

export type Invoice = {
  id: string;
  doctor_id: string;
  user: User;
  platform: string;
  outstanding: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
};

export type GetDoctorInvoices = Pagination & {
  invoices: Invoice[];
};
