import { ReactNode } from "react";
import { getDoctorNotificationsApi } from "@/services/apis/notifications.api";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import NotificationItem from "./notification-item";
import Loader from "@/app/_components/shared/loader";

export default async function RecentNotifications() {
  const res = await getDoctorNotificationsApi();

  if (!res.ok) {
    const { message } = res.body;

    return (
      <NotificationWrapper>
        <p className="text-center text-sm font-medium text-black">
          {message || "Error getting notifications"}
        </p>
      </NotificationWrapper>
    );
  }

  const { notifications } = res.body;

  if (notifications.length === 0) {
    return (
      <NotificationWrapper>
        <Empty className="flex flex-1 items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No recent notifications
            </p>
          </EmptyContent>
        </Empty>
      </NotificationWrapper>
    );
  }

  const recent = notifications.slice(0, 5);

  return (
    <NotificationWrapper>
      <ul className="flex flex-col divide-y divide-gray-100">
        {recent.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </NotificationWrapper>
  );
}

function NotificationWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="border-Iron w-full max-w-98 space-y-2 rounded-lg border px-2 py-3 lg:px-4 lg:py-6">
      <h2 className="text-DarkJungleGreen text-xl font-bold lg:text-2xl">
        Latest Notifications
      </h2>

      {children}
    </div>
  );
}

export function NotificationsLoader() {
  return (
    <NotificationWrapper>
      <Loader text="Getting notifications..." />
    </NotificationWrapper>
  );
}
