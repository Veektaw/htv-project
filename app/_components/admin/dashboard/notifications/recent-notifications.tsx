import { getNotificationsApi } from "@/services/apis/notifications.api";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import NotificationItem from "./notification-item";

export default async function RecentNotifications() {
  const res = await getNotificationsApi();

  if (!res.ok) {
    const { message } = res.body;
    return (
      <>
        <div className="space-y-2">
          <h2 className="text-MediumGrey text-sm">Invoice</h2>
          <h3 className="text-DarkJungleGreen text-2xl font-bold">
            Latest Notifications
          </h3>
        </div>
        <div className="flex size-full items-center justify-center p-2">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting notifications"}
          </p>
        </div>
      </>
    );
  }

  const { notifications } = res.body;

  if (notifications.length === 0) {
    return (
      <>
        <div className="space-y-2">
          <h2 className="text-MediumGrey text-sm">Invoice</h2>
          <h3 className="text-DarkJungleGreen text-2xl font-bold">
            Latest Notifications
          </h3>
        </div>
        <Empty className="flex flex-1 items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No recent notifications
            </p>
          </EmptyContent>
        </Empty>
      </>
    );
  }

  const recent = notifications.slice(0, 5);

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-MediumGrey text-sm">Invoice</h2>
        <h3 className="text-DarkJungleGreen text-2xl font-bold">
          Latest Notifications
        </h3>
      </div>
      <ul className="flex flex-col divide-y divide-gray-100">
        {recent.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </>
  );
}
