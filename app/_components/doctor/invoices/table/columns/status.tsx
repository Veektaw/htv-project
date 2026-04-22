import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types/invoices";

export const statuses: Record<InvoiceStatus, string> = {
  under_review: "Under Review",
  approved: "Approved",
  paid: "Paid",
  rejected: "Disputed",
  disputed: "Disputed",
};

export default function Status({ value }: { value: InvoiceStatus }) {
  return (
    <div
      className={cn(
        "min-w-32 rounded-xl px-5 py-1.5 text-center text-xs font-semibold",
        value === "under_review" && "text-LightMustard bg-LightMustard/10",
        value === "approved" && "text-GreenHaze bg-GreenHaze/10",
        value === "paid" && "text-GreenHaze bg-GreenHaze/10",
        value === "rejected" && "text-PortlandOrange bg-PortlandOrange/10",
      )}
    >
      {statuses[value]}
    </div>
  );
}
