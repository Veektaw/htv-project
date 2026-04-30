import { User } from "./auth";
import { Pagination } from "./users";

export type NotificationType =
  | "reconciliation_ready"
  | "invoice_created"
  | "comment_added";

export type NotificationEntity = "reconciliation" | "invoice" | "payment";

export type Notification = {
  id: string;
  type: NotificationType;
  entity: NotificationEntity;
  entity_id: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GetNotificationsResponse = {
  total: number;
  page: number;
  limit: number;
  total_page: number;
  notifications: Notification[];
};

export type GetNotificationsParams = {
  page?: number;
  limit?: number;
};

export type DoctorNotificationType =
  | "admin_comment_added"
  | "doctor_reconciliation_ready"
  | "reconciliation_approved"
  | "payment_logged"
  | "invoice_updated";

export type DoctorNotification = {
  id: string;
  user_id: string;
  user: User;
  type: DoctorNotificationType;
  entity: NotificationEntity;
  entity_id: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GetDoctorNotificationsResponse = Pagination & {
  notifications: DoctorNotification[];
};
