import { User } from "./auth";
import { Pagination } from "./users";

export type InvoiceStatus =
  | "under_review"
  | "approved"
  | "paid"
  | "disputed"
  | "rejected";

export type Invoice = {
  id: string;
  user_id: string;
  user: User;
  period_month: string;
  platform: string;
  file_url: string | null;
  status: InvoiceStatus;
  amount: number;
  submitted_at: string | null;
  notes: string;
  reviewed_by: string | null;
  reconciliation_id: string;
  invoice_ref: string;
  created_at: string;
  updated_at: string;
};

export type GetInvoicesParams = {
  page?: string;
  limit?: string;
  doctor_id?: string;
  invoice_id?: string;
  search?: string;
  status?: string;
};

export type GetInvoicesResponse = {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  total_page: number;
};

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
  period_month: string;
  platform: string;
  amount: number;
};

export type CreateManualInvoiceApiPayload = {
  period_month: string;
  platform: string;
  amount: number;
};

export type CreateManualInvoiceResponse = Invoice;

export type GetDoctorInvoices = Pagination & {
  invoices: Invoice[];
};

export type InvoiceComment = {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  message: string;
  invoice_id: string;
  payment_id: string | null;
  reconciliation_id: string | null;
  period_month: string | null;
  user_id: string;
};

export type DoctorComment = {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  message: string;
  invoice_id: string | null;
  payment_id: string | null;
  reconciliation_id: string | null;
  period_month: string | null;
  user_id: string;
};

export type GetDoctorCommentsResponse = Pagination & {
  comments: DoctorComment[];
};
