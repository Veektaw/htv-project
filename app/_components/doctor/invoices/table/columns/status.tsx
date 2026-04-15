import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types/invoices";

export default function Status({ value }: { value: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "capitalize",
        value === "paid"
          ? "text-KellyGreen"
          : value === "rejected"
            ? "text-PortlandOrange"
            : "text-yellow-500",
      )}
    >
      {value}
    </span>
  );
}
