"use client";

import { usePayments } from "../contexts/payments-provider";
import { PaymentColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { payments } = usePayments();

  return (
    <TableComponent
      title="Doctors Payments"
      columns={PaymentColumns}
      data={payments}
    />
  );
}
