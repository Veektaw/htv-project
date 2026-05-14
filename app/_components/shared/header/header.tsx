import { ReactNode } from "react";
import Username from "./username";

export default function Header({
  type,
  children,
}: {
  type: string;
  children: ReactNode;
}) {
  return (
    <header className="space-y-6">
      <section className="flex h-14 items-center justify-between gap-4">
        <div className="bg-BlueChalk rounded-2xl px-1.5 py-2">
          <span className="bg-PortlandOrange rounded-2xl px-2.5 py-1.5 text-xs font-semibold text-white">
            {type}
          </span>
        </div>

        <Username />
      </section>

      {children}
    </header>
  );
}
