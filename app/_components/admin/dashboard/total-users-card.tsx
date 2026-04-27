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
