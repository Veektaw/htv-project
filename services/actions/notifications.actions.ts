"use server";

import { getNotificationsApi, markNotificationAsReadApi } from "@/services/apis/notifications.api";
import { revalidatePath } from "next/cache";

export const markNotificationAsReadAction = async (id: string) => {
  const res = await markNotificationAsReadApi(id);

  if (!res.ok) {
    return { error: true, message: res.body.message || "Failed to mark as read" };
  }

 
  revalidatePath("/", "layout");
  return { error: false, message: "Notification marked as read" };
};

export const getNotificationsAction = async () => {
  const res = await getNotificationsApi();
  return res;
};