import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Reconciliation } from "@/types/reconciliations";

export default function ViewReconciliationDetailsModal({
  children,
  reconciliation,
}: {
  children: ReactNode;
  reconciliation: Reconciliation;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Reconciliation Details</DialogTitle>
        </DialogHeader>
        <h1>{reconciliation.id}</h1>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Doctor ID:</label>
            <p>{reconciliation.doctor_id}</p>
          </div>
          <div>
            <label className="font-semibold">Adyen Paid:</label>
            <p>{reconciliation.adyen_paid}</p>
          </div>
          <div>
            <label className="font-semibold">Amount:</label>
            <p>
              €
              {reconciliation.manual_paid.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <p>{reconciliation.status}</p>
          </div>
          <div>
            <label className="font-semibold">Date Created:</label>
            <p>{new Date(reconciliation.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="font-semibold">Period Month:</label>
            <p>{reconciliation.period_month}</p>
          </div>

          <div>
            <label className="font-semibold">Platform:</label>
            <p>{reconciliation.platform}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
