import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Prescription } from "@/types/prescriptions";
import { formatPrescriptionDate } from "@/lib/utils";
import SortableHeader from "@/app/_components/shared/table-component/sortable-header";

type ColumnType = Prescription & { actions?: ReactNode };

export const prescriptionColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="User ID" sortKey="full_name" />,
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Email",
    key: "email",
    renderTitle: () => <SortableHeader label="Email" sortKey="email" />,
    render: (_, record) => record.user.email,
  },
  {
    title: "Date",
    key: "period_month",
    renderTitle: () => <SortableHeader label="Date" sortKey="period_month" />,
    render: (value) => formatPrescriptionDate(value as string),
  },
  {
    title: "Platform",
    key: "platform",
    renderTitle: () => <SortableHeader label="Platform" sortKey="platform" />,
    render: (value) => value as string,
  },
  {
    title: "Prescriptions",
    key: "prescription_count",
    renderTitle: () => (
      <SortableHeader label="Prescriptions" sortKey="prescription_count" />
    ),
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    renderTitle: () => <SortableHeader label="Batch ID" sortKey="batch_id" />,
    render: (value) => value as string,
  },
];
