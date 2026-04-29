// import { getNotificationsApi } from "@/services/apis/notifications.api";
// import { Empty, EmptyContent } from "@/app/_components/ui/empty";
// import NotificationItem from "./notification-item";

// export default async function RecentNotifications() {
//   const res = await getNotificationsApi();

//   if (!res.ok) {
//     const { message } = res.body;
//     return (
//       <>
//         <div className="space-y-2">
//           <h2 className="text-MediumGrey text-sm">Invoice</h2>
//           <h3 className="text-DarkJungleGreen text-2xl font-bold">
//             Latest Notifications
//           </h3>
//         </div>
//         <div className="flex size-full items-center justify-center p-2">
//           <p className="text-center text-sm font-medium text-black">
//             {message || "Error getting notifications"}
//           </p>
//         </div>
//       </>
//     );
//   }

//   const { notifications } = res.body;

//   if (notifications.length === 0) {
//     return (
//       <>
//         <div className="space-y-2">
//           <h2 className="text-MediumGrey text-sm">Invoice</h2>
//           <h3 className="text-DarkJungleGreen text-2xl font-bold">
//             Latest Notifications
//           </h3>
//         </div>
//         <Empty className="flex flex-1 items-center justify-center p-2">
//           <EmptyContent>
//             <p className="text-MistBlue w-full max-w-84 text-center text-sm">
//               No recent notifications
//             </p>
//           </EmptyContent>
//         </Empty>
//       </>
//     );
//   }

//   const recent = notifications.slice(0, 5);

//   return (
//     <>
//       <div className="space-y-2">
//         <h2 className="text-MediumGrey text-sm">Invoice</h2>
//         <h3 className="text-DarkJungleGreen text-2xl font-bold">
//           Latest Notifications
//         </h3>
//       </div>
//       <ul className="flex flex-col divide-y divide-gray-100">
//         {recent.map((notification) => (
//           <NotificationItem key={notification.id} notification={notification} />
//         ))}
//       </ul>
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/types/notifications";
import { getNotificationsAction } from "@/services/actions/notifications.actions";
import NotificationItem from "./notification-item";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";

export default function RecentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    const res = await getNotificationsAction();
    if (!res.ok) {
      setError(res.body.message || "Error getting notifications");
    } else {
      setNotifications(res.body.notifications.slice(0, 5));
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const res = await getNotificationsAction();
      if (cancelled) return;
      if (!res.ok) {
        setError(res.body.message || "Error getting notifications");
      } else {
        setNotifications(res.body.notifications.slice(0, 5));
      }
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true; // 👈 cleanup
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-sm font-medium text-black">{error}</p>
    );

  if (notifications.length === 0) {
    return (
      <Empty className="flex flex-1 items-center justify-center p-2">
        <EmptyContent>
          <p className="text-MistBlue w-full max-w-84 text-center text-sm">
            No recent notifications
          </p>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-MediumGrey text-sm">Invoice</h2>
        <h3 className="text-DarkJungleGreen text-2xl font-bold">
          Latest Notifications
        </h3>
      </div>
      <ul className="flex flex-col divide-y divide-gray-100">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={fetchNotifications}
          />
        ))}
      </ul>
    </>
  );
}
