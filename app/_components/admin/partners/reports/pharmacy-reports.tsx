"use client";

import { useState } from "react";
import { usePartners } from "../contexts/partners-context";
import { Pharmacy } from "@/types/partners";
import { Button } from "@/app/_components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import OrderCsvModal from "./modals/order-csv-modal";
import ReconciliationCommentModal from "./modals/reconciliation-comment-modal";
import ScatterChart from "./scatter-chart";

const formatMoney = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  return "€" + (v % 1 === 0 ? v.toLocaleString() : v.toFixed(2));
};

export default function PharmacyReports() {
  const {
    pharmacies,
    products,
    computeReconciliation,
    generateInvoiceFromReconciliation,
    getComments,
  } = usePartners();

  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [isOrderCsvOpen, setIsOrderCsvOpen] = useState(false);
  const [targetPharmacyForCsv, setTargetPharmacyForCsv] = useState<string>("");
  const [commentPharmacy, setCommentPharmacy] = useState<Pharmacy | null>(null);

  const rows = pharmacies.map(computeReconciliation);
  const filteredRows =
    selectedPartnerFilter === "all"
      ? rows
      : rows.filter((r) => r.ph.id === selectedPartnerFilter);

  const workedExample = rows[0];

  return (
    <div className="space-y-5">
      {/* Page Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-RangoonGreen text-2xl font-extrabold tracking-tight">
            Pharmacy Reconciliation &amp; Reporting
          </h1>
          <span className="bg-[#fdf3d8] text-[#a9790a] rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide">
            FORMULA UNCONFIRMED
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTargetPharmacyForCsv(pharmacies[0]?.id || "");
            setIsOrderCsvOpen(true);
          }}
          className="border-border-strong rounded-full px-4 py-2 text-xs font-bold text-RangoonGreen hover:bg-gray-50 cursor-pointer"
        >
          ↑ Import Orders Fulfilled CSV
        </Button>
      </div>

      {/* Formula Explanation Card */}
      <div className="border-border bg-white rounded-2xl border p-6 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] text-xs text-MistBlue leading-relaxed space-y-3.5">
        <p>
          Implements the concept doc&apos;s formula: <strong>Total from Pharmacy CSV − (Adyen + Bank Transfer) = Total Outstanding − Total Markup + Platform Fees.</strong> The concept doc itself flags this as ambiguous on two points (see data-model doc) — the prototype below assumes Total Outstanding is computed first, then markup/fees are applied as a second step to reach the final invoiced amount. <strong>Not yet validated against real numbers</strong> — worked examples with the stakeholder are the recommended next step before this ships.
        </p>

        {workedExample && (
          <div className="bg-[#f9fafc] border-border rounded-xl border p-4 text-xs space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-RangoonGreen">
                Worked example — {workedExample.ph.name}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${
                  workedExample.usingRealOrders
                    ? "bg-[#e1f5ea] text-[#1f9254]"
                    : "bg-[#fdf3d8] text-[#a9790a]"
                }`}
              >
                {workedExample.usingRealOrders
                  ? "✓ from committed CSV"
                  : "APPROXIMATED — no committed Orders CSV yet"}
              </span>
            </div>

            <div className="text-MistBlue text-[11px] leading-relaxed pt-1">
              CSV Fulfilled Total {formatMoney(workedExample.csvTotal)} − (Adyen {formatMoney(workedExample.paidAdyen)} + Bank Transfer {formatMoney(workedExample.paidBank)})
              = Outstanding <strong className="text-RangoonGreen">{formatMoney(workedExample.outstanding)}</strong>
              <br />
              Outstanding {formatMoney(workedExample.outstanding)} − Markup {formatMoney(workedExample.totalMarkup)} + Platform Fees {formatMoney(workedExample.platformFees)}
              = Final Invoiced Amount <strong className="text-PortlandOrange font-extrabold">{formatMoney(workedExample.finalAmount)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Reconciliation Table Card */}
      <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <select
            value={selectedPartnerFilter}
            onChange={(e) => setSelectedPartnerFilter(e.target.value)}
            className="border-border-strong rounded-full border bg-white px-4 py-2 text-xs font-bold text-RangoonGreen outline-none cursor-pointer"
          >
            <option value="all">Sort By Partner</option>
            {pharmacies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="border-border-strong text-RangoonGreen flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-xs font-bold hover:bg-gray-50 cursor-pointer">
              <span>From 📅</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent text-xs font-medium text-RangoonGreen outline-none cursor-pointer"
              />
            </label>
            <label className="border-border-strong text-RangoonGreen flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-xs font-bold hover:bg-gray-50 cursor-pointer">
              <span>To 📅</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent text-xs font-medium text-RangoonGreen outline-none cursor-pointer"
              />
            </label>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="text-xs text-MistBlue hover:text-RangoonGreen underline font-semibold px-1 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
                <th className="px-5 py-3.5 font-bold">Pharmacy</th>
                <th className="px-5 py-3.5 font-bold">CSV Fulfilled Total</th>
                <th className="px-5 py-3.5 font-bold">Adyen Paid</th>
                <th className="px-5 py-3.5 font-bold">Bank Transfer Paid</th>
                <th className="px-5 py-3.5 font-bold">Outstanding</th>
                <th className="px-5 py-3.5 font-bold">Total Markup</th>
                <th className="px-5 py-3.5 font-bold">Platform Fees</th>
                <th className="px-5 py-3.5 font-bold">Final Invoiced Amount</th>
                <th className="px-5 py-3.5 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredRows.map((r) => {
                const commentCount = getComments("reconciliation", r.ph.id).length;

                return (
                  <tr key={r.ph.id} className="hover:bg-[#fafbff] transition-colors">
                    <td className="px-5 py-4 font-bold text-RangoonGreen text-sm">
                      {r.ph.name}
                    </td>
                    <td className="px-5 py-4 font-bold text-RangoonGreen">
                      {formatMoney(r.csvTotal)}
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide ${
                            r.usingRealOrders
                              ? "bg-[#e1f5ea] text-[#1f9254]"
                              : "bg-[#fdf3d8] text-[#a9790a]"
                          }`}
                        >
                          {r.usingRealOrders ? "✓ from committed CSV" : "APPROXIMATED"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-RangoonGreen font-medium">
                      {formatMoney(r.paidAdyen)}
                    </td>
                    <td className="px-5 py-4 text-RangoonGreen font-medium">
                      {formatMoney(r.paidBank)}
                    </td>
                    <td className="px-5 py-4 font-bold text-RangoonGreen">
                      {formatMoney(r.outstanding)}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#c8382f]">
                      −{formatMoney(r.totalMarkup)}
                    </td>
                    <td className="px-5 py-4 font-bold text-RangoonGreen">
                      +{formatMoney(r.platformFees)}
                    </td>
                    <td className="px-5 py-4 text-sm font-extrabold text-RangoonGreen">
                      {formatMoney(r.finalAmount)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full text-MistBlue hover:bg-gray-100 hover:text-RangoonGreen cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border">
                          <DropdownMenuItem
                            onClick={() => {
                              setTargetPharmacyForCsv(r.ph.id);
                              setIsOrderCsvOpen(true);
                            }}
                            className="cursor-pointer text-xs font-semibold py-2"
                          >
                            Import Orders CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setCommentPharmacy(r.ph)}
                            className="cursor-pointer text-xs font-semibold py-2"
                          >
                            Comment{commentCount > 0 && ` (${commentCount})`}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              generateInvoiceFromReconciliation(r.ph.id)
                            }
                            className="cursor-pointer text-xs font-semibold py-2"
                          >
                            Generate Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataviz Section: Markup vs Volume Sold Scatter Plot */}
      <ScatterChart products={products} />

      <OrderCsvModal
        isOpen={isOrderCsvOpen}
        onClose={() => setIsOrderCsvOpen(false)}
        initialPharmacyId={targetPharmacyForCsv}
      />

      <ReconciliationCommentModal
        isOpen={Boolean(commentPharmacy)}
        onClose={() => setCommentPharmacy(null)}
        pharmacy={commentPharmacy}
      />
    </div>
  );
}
