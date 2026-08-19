"use client";

import { Pharmacy } from "@/types/partners";
import { usePartners } from "../../contexts/partners-context";

export default function OverviewTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const { users, products, invoices } = usePartners();

  const pharmacyUsers = users.filter((u) => u.pharmacyId === pharmacy.id);
  const pharmacyProducts = products.filter((p) => p.pharmacyId === pharmacy.id);
  const pharmacyInvoices = invoices.filter((i) => i.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-4">
      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-border rounded-2xl border bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
          <div>
            <span className="text-MistBlue text-xs font-semibold">
              Pharmacy Users
            </span>
            <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
              {pharmacyUsers.length}
            </p>
          </div>
        </div>

        <div className="border-border rounded-2xl border bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
          <div>
            <span className="text-MistBlue text-xs font-semibold">
              Products in catalog
            </span>
            <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
              {pharmacyProducts.length}
            </p>
          </div>
        </div>

        <div className="border-border rounded-2xl border bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
          <div>
            <span className="text-MistBlue text-xs font-semibold">
              Invoices (all time)
            </span>
            <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
              {pharmacyInvoices.length}
            </p>
          </div>
        </div>
      </div>

      <p className="text-MistBlue text-xs leading-relaxed">
        Use the tabs above to manage this pharmacy&apos;s users, product catalog, and invoices — all nested under this detail view per the existing organization/vendor detail pattern.
      </p>
    </div>
  );
}
