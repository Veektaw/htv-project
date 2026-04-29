"use client";

import { useTransition, useState } from "react";
import { markNotificationAsReadAction } from "@/services/actions/notifications.actions";
import type { Notification } from "@/types/notifications";
import { useRouter } from "next/navigation";
type NotificationItemProps = {
  notification: Notification;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
const entityRouteMap: Record<string, string> = {
  invoice: "/admin/invoices",
  payment: "/admin/payments",
  reconciliation: "/admin/reconciliations",
  user: "/admin/users",
};
const getRoute = (
  entity: string,
  entityId: string,
  title: string,
): string | null => {
  const base = entityRouteMap[entity.toLowerCase()];
  if (!base) return null;
  return `${base}?entity_id=${entityId}&title=${encodeURIComponent(title)}`;
};
export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isRead, setIsRead] = useState(notification.is_read);
  const router = useRouter();
  const handleClick = () => {
    if (isPending) return;

    const route = getRoute(
      notification.entity,
      notification.entity_id,
      notification.title,
    );
    console.log("notification:", notification);
    console.log("route:", route);
    if (!isRead) {
      setIsRead(true);

      startTransition(async () => {
        const res = await markNotificationAsReadAction(notification.id);

        if (res.error) {
          setIsRead(false);
          return;
        }

        if (route) router.push(route);
      });
    } else {
      // already read — just navigate
      if (route) router.push(route);
    }
  };

  return (
    <li
      onClick={handleClick}
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
