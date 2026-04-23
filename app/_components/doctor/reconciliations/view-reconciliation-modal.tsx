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

        <div className="rounded-3xl border border-[#B4B4B4] px-6 py-10.5">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Platform:
              </span>
              <span className="font-inter text-sm text-black">
                {reconciliation.platform}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Date:
              </span>
              <span className="font-inter text-sm text-black">
                {formatPeriodMonth(reconciliation.period_month)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Status:
              </span>
              <span className="font-inter text-sm text-black capitalize">
                {reconciliation.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Est. Commissions:
              </span>
              <span className="font-inter text-sm text-black">
                ${reconciliation.gross_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
