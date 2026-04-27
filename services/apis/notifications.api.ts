
import { GetNotificationsResponse } from "@/types/notifications";
import { Api } from "./api";

export const getNotificationsApi = async () => {
  const res = await Api.get<GetNotificationsResponse>(
    "/admin/notifications/notifications/",
    true,
  );
  return res;
};

export const markNotificationAsReadApi = async (id: string) => {
  const res = await Api.post(
    "/admin/notifications/notifications/mark-as-read",
    [id], 
    true
  );
  return res;
};