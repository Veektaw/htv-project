import { User } from "./auth";
import { Pagination } from "./users";

export type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  entity: string;
  entity_id: string;
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

export type NotificationType = "invoice_updated";

export type NotificationEntity = "invoice";

export type DoctorNotification = {
  id: string;
  user_id: string;
  user: User;
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

export type GetDoctorNotificationsResponse = Pagination & {
  notifications: DoctorNotification[];
};
