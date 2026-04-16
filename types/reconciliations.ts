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

export type ReconciliationStatus = "pending" | "approved" | "completed";

export type Reconciliation = {
  id: string;
  doctor_id: string;
  user: User;
  platform: string;
  period_month: string;
  gross_amount: number;
  adyen_paid: number;
  outstanding: number;
  status: ReconciliationStatus;
  created_at: string;
  updated_at: string;
};

export type GetDoctorReconciliations = Pagination & {
  reconciliations: Reconciliation[];
};

export type UpdateReconciliationPayload = { action_type: string };
