import { Suspense } from "react";
import { getUsersApi } from "@/services/apis/users.api";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function TotalUsersCard() {
  const res = await getUsersApi({});

  let total = 0;

  if (res.ok) {
    total = res.body.total;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card text="Total Users" value={total} percentage="+0%" />
    </Suspense>
  );
}
