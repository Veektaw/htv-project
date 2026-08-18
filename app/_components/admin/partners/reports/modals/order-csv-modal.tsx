"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners, CURRENT_PERIOD } from "../../contexts/partners-context";
import { OrderCsvRowPreview } from "@/types/partners";

const MOCK_ORDER_CSV_PREVIEW: OrderCsvRowPreview[] = [
  {
    row: 2,
    orderId: "ORD-88291",
    product: "Paracetamol 500mg",
    qty: 1200,
    amount: 18000,
    dateFulfilled: "02 Jul 2026",
    status: "ok",
    rowType: "order",
  },
  {
    row: 3,
    orderId: "ORD-88304",
    product: "Amoxicillin 250mg",
    qty: 400,
    amount: 23200,
    dateFulfilled: "05 Jul 2026",
    status: "ok",
    rowType: "order",
  },
  {
    row: 4,
    orderId: "ORD-88317",
    product: "Vitamin C 1000mg",
    qty: -50,
    amount: -1000,
    dateFulfilled: "07 Jul 2026",
    status: "ok",
    rowType: "refund",
  },
  {
    row: 5,
    orderId: "",
    product: "Ibuprofen 400mg",
    qty: 600,
    amount: 9600,
    dateFulfilled: "09 Jul 2026",
    status: "error",
    error: "Order ID is required",
    rowType: "order",
  },
  {
    row: 6,
    orderId: "ORD-88342",
    product: "Weight Loss Starter Program",
    qty: 12,
    amount: 2640,
    dateFulfilled: "11 Jul 2026",
    status: "ok",
    rowType: "order",
  },
];

type OrderCsvModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPharmacyId?: string;
};

function OrderCsvWizard({
  initialPharmacyId,
  onClose,
}: {
  initialPharmacyId?: string;
  onClose: () => void;
}) {
  const { pharmacies, checkDuplicateJob, commitOrdersCsv } = usePartners();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPhId, setSelectedPhId] = useState<string>(
    initialPharmacyId || pharmacies[0]?.id || "ph1"
  );
  const [confirmedDuplicate, setConfirmedDuplicate] = useState(false);

  const ph = pharmacies.find((p) => p.id === selectedPhId) || pharmacies[0];
  const duplicateJob = ph ? checkDuplicateJob(ph.id, "orders_fulfilled", CURRENT_PERIOD) : undefined;
  const okRows = MOCK_ORDER_CSV_PREVIEW.filter((r) => r.status === "ok");
  const refundRows = okRows.filter((r) => r.rowType === "refund");
  const errRows = MOCK_ORDER_CSV_PREVIEW.filter((r) => r.status === "error");
  const okCount = okRows.length;
  const errCount = errRows.length;

  const handleCommit = () => {
    if (!ph) return;
    const records = okRows.map((r) => ({
      pharmacyId: ph.id,
      period: CURRENT_PERIOD,
      orderId: r.orderId,
      product: r.product,
      qty: r.qty,
      amount: r.amount,
      dateFulfilled: r.dateFulfilled,
      rowType: r.rowType,
    }));
    commitOrdersCsv(ph.id, CURRENT_PERIOD, records);
    onClose();
  };

  const cadenceLabel =
    ph?.cadence === "biweekly" ? "Biweekly" : "Monthly";

  return (
    <div className="space-y-4 pt-1">
      {/* Steps bar */}
      <div className="flex gap-0 mb-5">
        <div
          className={`flex-1 text-center text-xs font-bold pb-2.5 border-b-[3px] transition-colors ${
            step > 1
              ? "text-[#1f9254] border-[#1f9254]"
              : step === 1
              ? "text-[#f15b41] border-[#f15b41]"
              : "text-[#8c91a4] border-[#e7e9f3]"
          }`}
        >
          1. Upload
        </div>
        <div
          className={`flex-1 text-center text-xs font-bold pb-2.5 border-b-[3px] transition-colors ${
            step > 2
              ? "text-[#1f9254] border-[#1f9254]"
              : step === 2
              ? "text-[#f15b41] border-[#f15b41]"
              : "text-[#8c91a4] border-[#e7e9f3]"
          }`}
        >
          2. Map &amp; Validate
        </div>
        <div
          className={`flex-1 text-center text-xs font-bold pb-2.5 border-b-[3px] transition-colors ${
            step === 3
              ? "text-[#f15b41] border-[#f15b41]"
              : "text-[#8c91a4] border-[#e7e9f3]"
          }`}
        >
          3. Preview &amp; Commit
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div>
          <div className="mb-3.5 space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[#5d6274]">
              Pharmacy*
            </label>
            <select
              value={selectedPhId}
              onChange={(e) => setSelectedPhId(e.target.value)}
              className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-[#d8dcee] rounded-2xl p-10 text-center text-[#5d6274] bg-[#fafbff]">
            <div className="text-[28px] mb-2.5">📁</div>
            <p className="text-[13.5px]">
              <strong className="text-[#15151a]">Drag and drop your orders CSV here</strong>, or click to browse.
            </p>
            <p className="text-[#8c91a4] text-xs mt-1">
              Columns expected: Order ID, Product, Quantity, Amount, Date Fulfilled.
            </p>
          </div>

          <div className="text-[#8c91a4] text-xs mt-3">
            Cadence for this pharmacy: <strong className="text-[#15151a]">{cadenceLabel}</strong> — set on the pharmacy&apos;s Edit form.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-xs font-bold text-[#15151a] bg-white border border-[#d8dcee] hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#15151a] hover:bg-black cursor-pointer shadow-xs"
            >
              Simulate Upload → orders_july.csv
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Map & Validate */}
      {step === 2 && (
        <div>
          <div className="text-[#8c91a4] text-xs mb-3 leading-relaxed">
            For <strong className="text-[#15151a]">{ph?.name}</strong>. {errCount} row(s) need attention. Note row 4 below — a refund/credit row (negative quantity and amount), which the concept doc mentions but doesn&apos;t specify a distinct format for (see open-questions doc).
          </div>

          <div className="border border-[#e7e9f3] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
                  <th className="px-3.5 py-3">Row</th>
                  <th className="px-3.5 py-3">Order ID</th>
                  <th className="px-3.5 py-3">Product</th>
                  <th className="px-3.5 py-3">Type</th>
                  <th className="px-3.5 py-3">Qty</th>
                  <th className="px-3.5 py-3">Amount</th>
                  <th className="px-3.5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9f3]">
                {MOCK_ORDER_CSV_PREVIEW.map((r) => (
                  <tr key={r.row} className="hover:bg-[#fafbff]">
                    <td className="px-3.5 py-3 text-[#8c91a4] font-medium">
                      {r.row}
                    </td>
                    <td className="px-3.5 py-3 font-mono font-bold text-[#15151a]">
                      {r.orderId || <span className="text-[#c8382f]">—</span>}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-[#15151a]">{r.product}</td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          r.rowType === "refund"
                            ? "bg-[#fbe2e1] text-[#c8382f]"
                            : "bg-gray-100 text-[#5d6274]"
                        }`}
                      >
                        {r.rowType === "refund" ? "Refund" : "Order"}
                      </span>
                    </td>
                    <td
                      className={`px-3.5 py-3 font-bold ${
                        r.qty < 0 ? "text-[#c8382f]" : "text-[#15151a]"
                      }`}
                    >
                      {r.qty}
                    </td>
                    <td
                      className={`px-3.5 py-3 font-bold ${
                        r.amount < 0 ? "text-[#c8382f]" : "text-[#15151a]"
                      }`}
                    >
                      €{Math.abs(r.amount).toLocaleString()}
                    </td>
                    <td className="px-3.5 py-3">
                      {r.status === "ok" ? (
                        <span className="bg-[#e1f5ea] text-[#1f9254] inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                          Valid
                        </span>
                      ) : (
                        <div>
                          <span className="bg-[#fbe2e1] text-[#c8382f] inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                            Error
                          </span>
                          {r.error && (
                            <div className="text-[#c8382f] text-[10px] mt-0.5 max-w-[240px]">
                              {r.error}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full px-5 py-2.5 text-xs font-bold text-[#15151a] bg-white border border-[#d8dcee] hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#15151a] hover:bg-black cursor-pointer shadow-xs"
            >
              Continue to Preview ({okCount} valid)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Commit */}
      {step === 3 && (
        <div>
          <div className="text-[#8c91a4] text-xs mb-3 leading-relaxed">
            Ready to commit <strong className="text-[#15151a]">{okCount} valid rows</strong> for <strong className="text-[#15151a]">{ph?.name}</strong>, period {CURRENT_PERIOD}. {errCount} row(s) will be skipped and flagged for correction.
          </div>

          <div className="border border-[#e7e9f3] rounded-xl bg-[#f9fafc] p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5d6274]">Rows to import</span>
              <strong className="text-[#15151a]">{okCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d6274]">Of which refund/credit rows</span>
              <strong className="text-[#15151a]">{refundRows.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d6274]">Rows with errors (skipped)</span>
              <strong className="text-[#c8382f]">{errCount}</strong>
            </div>
          </div>

          {duplicateJob && (
            <div className="bg-[#fff2ef] text-[#c8432c] rounded-xl p-3.5 mt-3.5 text-xs">
              ⚠️ {ph?.name} already has a committed orders-fulfilled upload for {CURRENT_PERIOD} ({duplicateJob.rowCount} rows, committed {duplicateJob.committedAt}). This looks like a duplicate.
              <label className="flex items-center gap-2 mt-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedDuplicate}
                  onChange={(e) => setConfirmedDuplicate(e.target.checked)}
                  className="rounded accent-PortlandOrange size-3.5"
                />
                <span>Yes, re-upload and replace it anyway</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full px-5 py-2.5 text-xs font-bold text-[#15151a] bg-white border border-[#d8dcee] hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={Boolean(duplicateJob && !confirmedDuplicate)}
              onClick={handleCommit}
              className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#15151a] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              Commit Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderCsvModal({
  isOpen,
  onClose,
  initialPharmacyId,
}: OrderCsvModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[640px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
            Import Orders Fulfilled CSV
          </DialogTitle>
          <div className="text-[#8c91a4] text-xs mt-1 text-left leading-relaxed">
            Distinct from the Inventory CSV on the Products tab — this feeds the reconciliation formula above, not the product catalog. Cadence is biweekly or monthly, configurable per pharmacy.
          </div>
        </DialogHeader>

        {isOpen && (
          <OrderCsvWizard
            key={`order-wizard-${initialPharmacyId || "default"}`}
            initialPharmacyId={initialPharmacyId}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
