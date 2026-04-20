import { User } from "./auth";
import { Pagination } from "./users";

export type GetAdminPaymentsParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
};

export type GetAdminPayments = {
  id: string;
  doctor_id: string;
  user: User;
  platform: string;
  period_month: string;
  prescription_count: number;
  rate_per_prescription: number;
  gross_amount: number;
  batch_id: string;
  created_at: string;
  updated_at: string;
};
export type CreatePaymentParams = {
  invoice_id: string;
  source: string;
  amount_paid: number;
  description: string;
  payment_date: string;
  payment_ref: string;
  doctor_id: string; // for the URL
};

export type DeletePaymentParams = {
  payment_id: string;
};

export type AdminPayments = Pagination & {
  payments: GetAdminPayments[];
};

