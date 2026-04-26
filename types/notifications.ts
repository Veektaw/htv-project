export type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;

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

