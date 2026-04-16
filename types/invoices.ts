import { User } from "./auth";
import { Pagination } from "./users";

export type InvoiceStatus = "under_review" | "approved" | "paid" | "rejected";

export type Invoice = {
  id: string;
  user_id: string;
  user: User;
  period_month: string;
  platform: string;
  file_url: string | null;
  status: string;
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
  search?: string;
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

export type GetDoctorInvoices = Pagination & {
  invoices: Invoice[];
};
