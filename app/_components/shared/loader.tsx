import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  text?: string;
  className?: string;
};

export default function Loader({ text, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center p-2",
        className,
      )}
    >
      <div className="flex w-full max-w-150.25 flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin" />
        <p className="text-center text-sm font-medium text-black">
          {text || "Getting data..."}
        </p>
      </div>
    </div>
  );
}
