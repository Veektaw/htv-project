import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      autoComplete="on"
      className={cn(
        "selection:bg-primary selection:text-primary-foreground placeholder:text-RangoonGreen/40 file:text-foreground dark:bg-input/30 border-GreenWhite rounded-base h-13.5 w-full min-w-0 border bg-transparent px-3 py-1 text-base outline-none file:inline-flex file:h-13.5 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
