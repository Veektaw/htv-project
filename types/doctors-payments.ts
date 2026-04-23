import { Pagination } from "./users";
import { User } from "./auth";

export type PaymentStatus = "pending" | "completed" | "failed";

export type GetDoctorPaymentsParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  status?: string;
};

export type Payment = {
  id: string;
  user_id: string;
  user: User;
  batch_id: string;
  platform: string;
  amount: number;
  submitted_at: string | null;
  notes: string;
  source: string | null;
  invoice_ref: string;
  created_at: string;
  updated_at: string;
};

export type GetDoctorPayments = Pagination & {
  payments: Payment[];
};
