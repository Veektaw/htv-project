import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types/invoices";

export default function Status({ value }: { value: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "capitalize",
        value === "Paid"
          ? "text-KellyGreen"
          : value === "Dispute Invoice"
            ? "text-[#FF513B]"
            : "text-yellow-500",
      )}
    >
      {value}
    </span>
  );
}
