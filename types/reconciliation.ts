import { User } from "./auth";
import { Pagination } from "./users";

export type GetDoctorReconciliationParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
};

export type ReconciliationStatus = "pending";

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

export type GetDoctorReconciliation = Pagination & {
  reconciliations: Reconciliation[];
};
