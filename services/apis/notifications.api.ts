
import { GetNotificationsResponse } from "@/types/notifications";
import { Api } from "./api";

export const getNotificationsApi = async () => {
  const res = await Api.get<GetNotificationsResponse>(
    "/admin/notifications/notifications/"
  );
  return res;
};