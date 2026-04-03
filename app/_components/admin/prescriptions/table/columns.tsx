import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Prescription } from "@/types/prescriptions";
import { formatPrescriptionDate } from "@/lib/utils";

type ColumnType = Prescription & { actions?: ReactNode };

export const prescriptionColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Email",
    key: "email",
    render: (_, record) => record.user.email,
  },
  {
    title: "Date",
    key: "period_month",
    render: (value) => formatPrescriptionDate(value as string),
  },
  {
    title: "Platform",
    key: "platform",
    render: (value) => value as string,
  },
  {
    title: "Prescription(s) Signed",
    key: "prescription_count",
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (value) => value as string,
  },
];
