"use client";

import { usePayments } from "../contexts/payments-provider";
import { paymentColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { payments } = usePayments();

  return (
    <TableComponent
      title="Payments"
      columns={paymentColumns}
      data={payments}
    />
  );
}
