import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Prescription } from "@/types/prescriptions";
import { formatPrescriptionDate } from "@/lib/utils";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Prescription & { actions?: ReactNode };

export const prescriptionColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="User ID" sort_by="full_name" />,
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Email",
    key: "email",
    renderTitle: () => <SortableHeader label="Email" sort_by="email" />,
    render: (_, record) => record.user.email,
  },
  {
    title: "Date",
    key: "period_month",
    renderTitle: () => <SortableHeader label="Date" sort_by="period_month" />,
    render: (value) => formatPrescriptionDate(value as string),
  },
  {
    title: "Partner",
    key: "platform",
    renderTitle: () => <SortableHeader label="Partner" sort_by="platform" />,
    render: (value) => value as string,
  },
  {
    title: "Prescriptions",
    key: "total_prescription",
    renderTitle: () => (
      <SortableHeader label="Prescriptions" sort_by="total_prescription" />
    ),
    render: (value) => (value as number) ?? 0,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    renderTitle: () => <SortableHeader label="Batch ID" sort_by="batch_id" />,
    render: (value) => value as string,
  },
];
