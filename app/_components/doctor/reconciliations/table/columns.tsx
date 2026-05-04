import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Reconciliation, ReconciliationStatus } from "@/types/reconciliations";
import { formatPrescriptionDate } from "@/lib/utils";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Reconciliation & { actions?: ReactNode };

export const reconciliationColumns: Column<ColumnType>[] = [
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
    title: "Est. Commissions",
    key: "gross_amount",
    renderTitle: () => (
      <SortableHeader label="Est. Commissions" sortKey="gross_amount" />
    ),
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Adyen Paid",
    key: "adyen_paid",
    renderTitle: () => (
      <SortableHeader label="Adyen Paid" sortKey="adyen_paid" />
    ),
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Manual Paid",
    key: "manual_paid",
    renderTitle: () => (
      <SortableHeader label="Manual Paid" sortKey="manual_paid" />
    ),
    render: () => "€0.00",
  },
  {
    title: "Date paid",
    key: "date_paid",
    renderTitle: () => <SortableHeader label="Date paid" sortKey="date_paid" />,
    render: () => "--",
  },
  {
    title: "Outstanding",
    key: "outstanding",
    renderTitle: () => (
      <SortableHeader label="Outstanding" sortKey="outstanding" />
    ),
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sortKey="status" />,
    render: (value) => <Status value={value as ReconciliationStatus} />,
  },
  {
    title: "",
    key: "actions",
    render: (_value, record) => (
      <MenuActions>
        <Actions reconciliation={record} />
      </MenuActions>
    ),
  },
];
