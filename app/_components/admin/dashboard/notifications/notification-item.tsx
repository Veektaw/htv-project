"use client";

import type { Notification } from "@/types/notifications";
import { markNotificationAsReadAction } from "@/services/actions/notifications.actions";
import { useTransition, useState } from "react";

type NotificationItemProps = {
  notification: Notification;
  onRead: () => void;
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
  onRead,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isRead, setIsRead] = useState(notification.is_read);

  const handleMarkAsRead = () => {
    if (isRead || isPending) return;

    setIsRead(true);

    startTransition(async () => {
      const res = await markNotificationAsReadAction(notification.id);

      if (res.error) {
        setIsRead(false);
      } else {
        onRead();
      }
    });
  };

  return (
    <li
      onClick={handleMarkAsRead}
      className={`flex flex-col gap-y-1 py-3 transition-opacity ${
        isPending
          ? "cursor-wait opacity-50"
          : isRead
            ? "cursor-default"
            : "cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-DarkJungleGreen text-sm font-medium">
          {notification.title}
        </p>
        {!isRead ? (
          <span
            className={`size-2 shrink-0 rounded-full bg-blue-500 ${isPending ? "animate-pulse" : ""}`}
          />
        ) : (
          <span className="size-2 shrink-0 rounded-full bg-gray-300" />
        )}
      </div>
      <p className="text-MediumGrey text-xs">{notification.message}</p>
      <p className="text-MistBlue text-xs">
        {formatDate(notification.created_at)}
      </p>
    </li>
  );
}
