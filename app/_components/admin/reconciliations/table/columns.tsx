import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Reconciliation } from "@/types/reconciliation";
import { formatPrescriptionDate } from "@/lib/utils";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";

type ColumnType = Reconciliation & { actions?: ReactNode };

export const reconciliationColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "name",
    render: (_, record) => record.user.full_name,
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
    title: "Est. Commissions",
    key: "gross_amount",
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Ayden Paid",
    key: "adyen_paid",
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Outstanding",
    key: "outstanding",
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Date paid",
    key: "date_paid",
    render: () => "--",
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <span className="capitalize">{value as string}</span>,
  },
  {
    title: "",
    key: "actions",
    render: () => (
      <MenuActions>
        <Actions />
      </MenuActions>
    ),
  },
];
