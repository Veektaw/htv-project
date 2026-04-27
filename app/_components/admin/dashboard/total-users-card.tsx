// import { Suspense } from "react";
// import { getUsersApi } from "@/services/apis/users.api";
// import Card, { CardLoader } from "../../shared/dashboard/card";

// export default async function TotalUsersCard() {
//   const res = await getUsersApi({});

//   let total = 0;

//   if (res.ok) {
//     total = res.body.total;
//   }

//   return (
//     <Suspense fallback={<CardLoader />}>
//       <Card text="Total Users" value={total} percentage="+68%" />
//     </Suspense>
//   );
// }
// import { getDashboardApi } from "@/services/apis/dashboard.api";
import Card, { CardLoader } from "../../shared/dashboard/card";
import { Suspense } from "react";

type TotalUsersCardProps = {
  value: number;
  percentage: string;
};

export default function TotalUsersCard({
  value,
  percentage,
}: TotalUsersCardProps) {
  return (
    <Suspense fallback={<CardLoader />}>
      <Card text="Total Users" value={value} percentage={percentage} />
    </Suspense>
  );
}
