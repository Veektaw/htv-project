import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/doctors-payments";

export const statuses: Record<PaymentStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
};

export default function Status({ value }: { value: PaymentStatus }) {
  return (
    <div
      className={cn(
        "min-w-32 rounded-xl px-5 py-1.5 text-center text-xs font-semibold",
        value === "pending" && "text-LightMustard bg-LightMustard/10",
        value === "completed" && "text-GreenHaze bg-GreenHaze/10",
        value === "failed" && "text-PortlandOrange bg-PortlandOrange/10",
      )}
    >
      {statuses[value]}
    </div>
  );
}
