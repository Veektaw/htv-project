"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
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

const entityRouteMap: Record<string, string> = {
  invoice: "/invoices",
  payment: "/payments",
  reconciliation: "/reconciliations",
  user: "/users",
};

const getRoute = (
  entity: string,
  entityId: string,
  type: DoctorNotification["type"],
): string | null => {
  const base = entityRouteMap[entity.toLowerCase()];
  if (!base) return null;
  return `${base}?entity_id=${entityId}&type=${type}`;
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [isRead, setIsRead] = useState(notification.is_read);

  const handleClick = () => {
    if (isPending) return;

    const route = getRoute(
      notification.entity,
      notification.entity_id,
      notification.type,
    );
    // console.log("notification:", notification);
    // console.log("route:", route);
    if (!isRead) {
      setIsRead(true);

      startTransition(async () => {
        const res = await markDoctorNotificationAsReadAction([notification.id]);

        if (res.error) {
          setIsRead(false);
          return;
        }

        if (route) router.push(route);
      });
    }

    if (route) router.push(route);
  };

  return (
    <li
      onClick={handleClick}
      className={cn(
        "flex flex-col gap-y-1 py-3",
        isPending ? "animate-pulse cursor-wait" : "cursor-pointer",
      )}
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
