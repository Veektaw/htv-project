"use client";

import { usePartners } from "../admin/partners/contexts/partners-context";
import PharmacyHeader from "./pharmacy-header";

export default function PharmacyDashboard() {
  const {
    pharmacies,
    portalPharmacyId,
    products,
    invoices,
    getPaidAmountForInvoice,
  } = usePartners();

  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];
  const phProducts = products.filter((p) => p.pharmacyId === ph?.id);
  const phInvoices = invoices.filter((i) => i.pharmacyId === ph?.id);

  const outstandingBalance = phInvoices.reduce((s, inv) => {
    const paid = getPaidAmountForInvoice(inv.id);
    return s + Math.max(0, inv.amount - paid);
  }, 0);

  const topProducts = [...phProducts]
    .sort((a, b) => b.unitsSold90d - a.unitsSold90d)
    .slice(0, 5);
  const maxUnits = topProducts.length ? topProducts[0].unitsSold90d || 1 : 1;

  return (
    <div className="space-y-5">
      <PharmacyHeader />

      <h1 className="text-RangoonGreen text-2xl font-extrabold tracking-tight">
        Dashboard
      </h1>

      <div className="space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-border rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] flex items-center gap-3.5">
            <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
            <div>
              <span className="text-MistBlue text-xs font-semibold">
                My Products
              </span>
              <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
                {phProducts.length}
              </p>
            </div>
          </div>

          <div className="border-border rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] flex items-center gap-3.5">
            <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
            <div>
              <span className="text-MistBlue text-xs font-semibold">
                Open Invoices
              </span>
              <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
                {phInvoices.filter((i) => i.status !== "paid").length}
              </p>
            </div>
          </div>

          <div className="border-border rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] flex items-center gap-3.5">
            <div className="bg-PortlandOrange w-1 self-stretch rounded-full" />
            <div>
              <span className="text-MistBlue text-xs font-semibold">
                Outstanding Balance
              </span>
              <p className="text-RangoonGreen text-2xl font-extrabold mt-1">
                €{outstandingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Fast Moving Products */}
        <div className="border-border rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)]">
          <div className="mb-4">
            <span className="text-MistBlue text-xs font-bold uppercase tracking-wider">
              My Inventory
            </span>
            <h2 className="text-RangoonGreen text-lg font-extrabold">
              My Fast-Moving Products
            </h2>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-MistBlue py-8 text-center text-xs">
                No products in catalog yet.
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[24px_1fr_120px] items-center gap-3"
                >
                  <span className="text-MistBlue text-xs font-extrabold">
                    #{i + 1}
                  </span>
                  <div className="relative h-6 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="bg-PortlandOrange flex h-full items-center rounded-full px-3 text-[11px] font-bold text-white transition-all duration-300"
                      style={{
                        width: `${Math.max(
                          18,
                          (p.unitsSold90d / maxUnits) * 100
                        )}%`,
                      }}
                    >
                      <span className="truncate">{p.name}</span>
                    </div>
                  </div>
                  <span className="text-RangoonGreen text-right text-xs font-extrabold">
                    {p.unitsSold90d.toLocaleString()}{" "}
                    <span className="text-MistBlue font-normal">units/90d</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
