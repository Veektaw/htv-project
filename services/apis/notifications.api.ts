
import { GetNotificationsResponse } from "@/types/notifications";
import { Api } from "./api";
import { unstable_noStore as noStore } from "next/cache";

export const getNotificationsApi = async () => {
  noStore();
  const res = await Api.get<GetNotificationsResponse>(
    "/admin/notifications/notifications/",
    true,
    { cache: "no-store" }
  );
  return res;
};

export const markNotificationAsReadApi = async (id: string) => {
  const res = await Api.post(
    "/admin/notifications/notifications/mark-as-read/",
    [id], 
    true
  );
  console.log("Response:", res);
  return res;
};