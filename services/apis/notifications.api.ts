import { Api } from "./api";
import {
  GetDoctorNotificationsResponse,
  GetNotificationsResponse,
} from "@/types/notifications";

export const getNotificationsApi = async () => {
  return await Api.get<GetNotificationsResponse>(
    "/admin/notifications/notifications/",
    true,
    { cache: "no-store" }
  );
};

export const markNotificationAsReadApi = async (id: string) => {
  return await Api.post(
    "/admin/notifications/notifications/mark-as-read",
    [id],
    true,
  );
};

export const getDoctorNotificationsApi = async () => {
  return await Api.get<GetDoctorNotificationsResponse>(
    "/doctor/notifications/",
    true,
  );
};

export const markDoctorNotificationAsReadApi = async (
  notificationIds: string[],
) => {
  return await Api.post<string[], { marked_as_read: number }>(
    "/doctor/notifications/mark-as-read/",
    notificationIds,
    true,
  );
};
