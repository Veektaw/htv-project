import { User } from "./auth";
import { Pagination } from "./users";

export type GetDoctorReconciliationsParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
};

export type ReconciliationStatus =
  | "pending"
  | "approved"
  | "completed"
  | "void";

export type Reconciliation = {
  id: string;
  doctor_id: string;
  user: User;
  platform: string;
  period_month: string;
  gross_amount: number;
  adyen_paid: number;
  outstanding: number;
  manual_paid: number;
  status: ReconciliationStatus;
  created_at: string;
  updated_at: string;
  prescription_count: number;
};
export type AdminCreateReconciliationParams = {
  doctor_id: string;
  manual_paid: number;
  platform: string;
  gross_amount: number;
  adyen_paid: number;
  outstanding: number;
  note: string;
  comment: string;
  period_month: string;
};
export type GetDoctorReconciliations = Pagination & {
  reconciliations: Reconciliation[];
};
export type ReconciliationComment = {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  message: string;
  invoice_id: string | null;
  payment_id: string | null;
  reconciliation_id: string;
  period_month: string | null;
  user_id: string;
};

export type ReconciliationCommentsResponse = {
  comments: ReconciliationComment[];
};
export type UpdateReconciliationPayload = { action_type: string };
