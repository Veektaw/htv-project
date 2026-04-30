"use server";

import { revalidatePath } from "next/cache";
import {
  markDoctorNotificationAsReadApi,
  markNotificationAsReadApi,
} from "@/services/apis/notifications.api";

export const markNotificationAsReadAction = async (id: string) => {
  const res = await markNotificationAsReadApi(id);

  if (!res.ok) {
    return {
      error: true,
      message: res.body.message || "Failed to mark as read",
    };
  }

  revalidatePath("/admin/dashboard", "page");
  return { error: false, message: "Notification marked as read" };
};

export const markDoctorNotificationAsReadAction = async (
  notificationIds: string[],
) => {
  const res = await markDoctorNotificationAsReadApi(notificationIds);

  if (!res.ok) {
    return { error: true, message: res.body.message };
  }

  revalidatePath("/dashboard", "page");
  return { error: false, message: "Notification marked as read" };
};