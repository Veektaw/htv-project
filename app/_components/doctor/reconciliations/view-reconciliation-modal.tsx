"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Reconciliation } from "@/types/reconciliations";
import { formatDate } from "@/lib/utils";

type ViewReconciliationModalProps = {
  children: ReactNode;
  reconciliation: Reconciliation;
};

export default function ViewReconciliationModal({
  children,
  reconciliation,
}: ViewReconciliationModalProps) {
  // Format period_month to a readable date
  const formatPeriodMonth = (periodMonth: string) => {
    const [year, month] = periodMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-171.5"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
            Reconciliation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Platform</label>
            <p>{reconciliation.platform}</p>
          </div>
          <div>
            <label className="font-semibold">Date</label>
            <p>{formatPeriodMonth(reconciliation.period_month)}</p>
          </div>
          <div>
            <label className="font-semibold">Status</label>
            <p>{reconciliation.status}</p>
          </div>
          <div>
            <label className="font-semibold">Est. Commissions:</label>
            <p>€{reconciliation.gross_amount.toFixed(2)}</p>
          </div>
          <div>
            <label className="font-semibold">Adyen Paid</label>
            <p>€{reconciliation.adyen_paid}</p>
          </div>
          <div>
            <label className="font-semibold">Manual Paid</label>
            <p>€{reconciliation.manual_paid}</p>
          </div>
          <div>
            <label className="font-semibold">Outstanding</label>
            <p>€{reconciliation.outstanding}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
