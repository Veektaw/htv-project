import { cn } from "@/lib/utils";

export default function UserStatus({
  deactivatedStatus,
}: {
  deactivatedStatus: boolean;
}) {
  return (
    <div
      className={cn(
        "w-32 rounded-xl px-4 py-1.5 text-center text-xs font-semibold",
        !deactivatedStatus
          ? "text-GreenHaze bg-KellyGreen/10"
          : "bg-PortlandOrange/10 text-PortlandOrange",
      )}
    >
      {!deactivatedStatus ? "Activated" : "Deactivated"}
    </div>
  );
}
