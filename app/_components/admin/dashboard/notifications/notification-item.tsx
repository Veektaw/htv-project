import { Notification } from "@/types/notifications";

type NotificationItemProps = {
  notification: Notification;
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  return (
    <li className="flex flex-col gap-y-1 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-DarkJungleGreen text-sm font-medium">
          {notification.title}
        </p>
        {!notification.is_read && (
          <span className="size-2 shrink-0 rounded-full bg-blue-500" />
        )}
      </div>
      <p className="text-MediumGrey text-xs">{notification.message}</p>
      <p className="text-MistBlue text-xs">
        {new Date(notification.created_at).toLocaleDateString()}
      </p>
    </li>
  );
}
