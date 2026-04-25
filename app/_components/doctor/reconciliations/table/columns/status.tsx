import { cn } from "@/lib/utils";
import { ReconciliationStatus } from "@/types/reconciliations";

export default function Status({ value }: { value: ReconciliationStatus }) {
  return (
    <span
      className={cn(
        "capitalize",
        value === "completed"
          ? "text-KellyGreen"
          : value === "approved"
            ? "text-ResolutionBlue"
            : value === "void"
              ? "text-red-500"
              : "text-yellow-500",
      )}
    >
      {value}
    </span>
  );
}
