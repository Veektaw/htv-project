import { User } from "./auth";
import { Pagination } from "./users";

export type GetDoctorPrescriptionsParams = {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
};

export type Prescription = {
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
  total_prescription: number | null;
};

export type GetDoctorPrescriptions = Pagination & {
  prescriptions: Prescription[];
};
