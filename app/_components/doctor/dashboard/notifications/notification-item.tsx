"use client";

import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import { markDoctorNotificationAsReadAction } from "@/services/actions/notifications.actions";
import type { DoctorNotification } from "@/types/notifications";

type NotificationItemProps = {
  notification: DoctorNotification;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isRead, setIsRead] = useState(notification.is_read);

  const handleMarkAsRead = () => {
    if (isRead || isPending) return;

    setIsRead(true);

    startTransition(async () => {
      const res = await markDoctorNotificationAsReadAction([notification.id]);

      if (res.error) {
        setIsRead(false);
      }
    });
  };

  return (
    <li
      onClick={handleMarkAsRead}
      className={cn(
        "flex flex-col gap-y-1 py-3",
        isPending && "animate-pulse cursor-wait",
        isRead ? "cursor-default" : "cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-DarkJungleGreen text-sm font-medium">
          {notification.title}
        </p>
        {!isRead && (
          <span
            className={`size-2 shrink-0 rounded-full bg-blue-500 ${isPending ? "animate-pulse" : ""}`}
          />
        )}
      </div>
      <p className="text-MediumGrey text-xs">{notification.message}</p>
      <p className="text-MistBlue text-xs">
        {formatDate(notification.created_at)}
      </p>
    </li>
  );
}
