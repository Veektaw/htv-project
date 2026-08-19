"use client";

import { useState } from "react";
import { Pharmacy, InvoiceDirection, PartnerInvoice } from "@/types/partners";
import { usePartners } from "../../contexts/partners-context";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import ViewInvoiceModal from "../modals/view-invoice-modal";
import CreateInvoiceModal from "../modals/create-invoice-modal";

export default function InvoicesTab({
  pharmacy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  portalMode,
}: {
  pharmacy: Pharmacy;
  portalMode?: boolean;
}) {
  const { invoices, getPaidAmountForInvoice } = usePartners();

  const [direction, setDirection] =
    useState<InvoiceDirection>("htv_to_pharmacy");
  const [selectedInvoice, setSelectedInvoice] = useState<PartnerInvoice | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredInvoices = invoices.filter(
    (i) => i.pharmacyId === pharmacy.id && i.direction === direction
  );

  return (
    <div className="space-y-4">
      {/* Direction Toggle & Actions */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="bg-[#eef0f7] inline-flex rounded-full p-1">
          <button
            type="button"
            onClick={() => setDirection("htv_to_pharmacy")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              direction === "htv_to_pharmacy"
                ? "bg-white text-RangoonGreen shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen"
            )}
          >
            HTV → Pharmacy
          </button>
          <button
            type="button"
            onClick={() => setDirection("pharmacy_to_htv")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              direction === "pharmacy_to_htv"
                ? "bg-white text-RangoonGreen shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Pharmacy → HTV
          </button>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="bg-RangoonGreen hover:bg-black rounded-full px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          + Create Invoice
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
                <th className="px-5 py-3.5">Invoice ID</th>
                <th className="px-5 py-3.5">Month</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Paid</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Created</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-MistBlue py-8 text-center text-xs">
                    No {direction === "htv_to_pharmacy" ? "HTV → Pharmacy" : "Pharmacy → HTV"} invoices yet.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const paid = getPaidAmountForInvoice(inv.id);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:bg-[#fafbff] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-RangoonGreen">
                        {inv.number}
                      </td>
                      <td className="px-5 py-4 text-RangoonGreen font-medium">
                        {inv.month}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-RangoonGreen">
                        €{inv.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 font-semibold text-RangoonGreen">
                        €{paid.toLocaleString()}
                        {paid < inv.amount && (
                          <span className="text-MistBlue text-[11px] font-normal ml-1">
                            of €{inv.amount.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                            inv.status === "paid"
                              ? "bg-[#e1f5ea] text-[#1f9254]"
                              : inv.status === "under_review"
                              ? "bg-[#fdf3d8] text-[#a9790a]"
                              : "bg-[#e4eefb] text-[#2a6fc9]"
                          }`}
                        >
                          {inv.status === "under_review"
                            ? "Under Review"
                            : inv.status === "paid"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-MistBlue">
                        {inv.dateCreated}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      <ViewInvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        pharmacy={pharmacy}
      />

      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        pharmacy={pharmacy}
        initialDirection={direction}
      />
    </div>
  );
}
