import Username from "./username";

export default function Header() {
  return (
    <header className="space-y-7.5">
      <section className="flex h-14 items-center justify-between gap-4">
        <div className="bg-BlueChalk rounded-2xl px-1.5 py-2">
          <span className="bg-PortlandOrnage rounded-2xl px-2.5 py-1.5 text-xs font-semibold text-white">
            Admin
          </span>
        </div>

        <Username />
      </section>

      <p className="py-2 text-base font-bold">Dashboard</p>
    </header>
  );
}
