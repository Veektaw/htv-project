"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners, CURRENT_PERIOD } from "../../contexts/partners-context";
import { Pharmacy, InventoryCsvRowPreview } from "@/types/partners";

const MOCK_INVENTORY_PREVIEW: InventoryCsvRowPreview[] = [
  {
    row: 2,
    name: "Paracetamol 500mg",
    qty: 2400,
    unit: "tablet",
    batchId: "B-2026-0071",
    status: "ok",
  },
  {
    row: 3,
    name: "Amoxicillin 250mg",
    qty: 900,
    unit: "capsule",
    batchId: "B-2026-0072",
    status: "ok",
  },
  {
    row: 4,
    name: "",
    qty: 150,
    unit: "tablet",
    batchId: "B-2026-0078",
    status: "error",
    error: "Name is required",
  },
  {
    row: 5,
    name: "Ibuprofen 400mg",
    qty: "abc",
    unit: "tablet",
    batchId: "B-2026-0077",
    status: "error",
    error: "Quantity must be a number",
  },
  {
    row: 6,
    name: "Vitamin C 1000mg",
    qty: 1500,
    unit: "tablet",
    batchId: "B-2026-0073",
    status: "ok",
  },
];

type InventoryCsvModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy;
};

function InventoryCsvWizard({
  pharmacy,
  onClose,
}: {
  pharmacy: Pharmacy;
  onClose: () => void;
}) {
  const { checkDuplicateJob, commitInventoryCsv } = usePartners();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmedDuplicate, setConfirmedDuplicate] = useState(false);

  const duplicateJob = checkDuplicateJob(pharmacy.id, "inventory", CURRENT_PERIOD);
  const okRows = MOCK_INVENTORY_PREVIEW.filter((r) => r.status === "ok");
  const errRows = MOCK_INVENTORY_PREVIEW.filter((r) => r.status === "error");
  const okCount = okRows.length;
  const errCount = errRows.length;

  const handleCommit = () => {
    commitInventoryCsv(pharmacy.id, CURRENT_PERIOD, okCount);
    onClose();
  };

  const cadenceLabel =
    pharmacy.cadence === "biweekly" ? "Biweekly" : "Monthly";

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
          <div className="border-2 border-dashed border-[#d8dcee] rounded-2xl p-10 text-center text-[#5d6274] bg-[#fafbff]">
            <div className="text-[28px] mb-2.5">📁</div>
            <p className="text-[13.5px]">
              <strong className="text-[#15151a]">Drag and drop your CSV file here</strong>, or click to browse.
            </p>
            <p className="text-[#8c91a4] text-xs mt-1">
              Columns expected: Name, Quantity, Unit, Batch ID, Pharmaceutical ID, Barcode ID, Manufacturer Price, Pharmaceutical Price, HTV Price.
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
              Simulate Upload → inventory_july.csv
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Map & Validate */}
      {step === 2 && (
        <div>
          <div className="text-[#8c91a4] text-xs mb-3">
            Column mapping detected automatically from headers. {errCount} row(s) need attention before this batch can be committed.
          </div>

          <div className="border border-[#e7e9f3] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
                  <th className="px-3.5 py-3">Row</th>
                  <th className="px-3.5 py-3">Name</th>
                  <th className="px-3.5 py-3">Qty</th>
                  <th className="px-3.5 py-3">Unit</th>
                  <th className="px-3.5 py-3">Batch ID</th>
                  <th className="px-3.5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9f3]">
                {MOCK_INVENTORY_PREVIEW.map((r) => (
                  <tr key={r.row} className="hover:bg-[#fafbff]">
                    <td className="px-3.5 py-3 text-[#8c91a4] font-medium">
                      {r.row}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-[#15151a]">
                      {r.name || <span className="text-[#c8382f]">—</span>}
                    </td>
                    <td className="px-3.5 py-3 text-[#15151a]">{r.qty}</td>
                    <td className="px-3.5 py-3 text-[#15151a]">{r.unit}</td>
                    <td className="px-3.5 py-3 font-mono text-[#15151a]">{r.batchId}</td>
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
                            <div className="text-[#c8382f] text-[10px] mt-0.5">
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
          <div className="text-[#8c91a4] text-xs mb-3">
            Ready to commit <strong className="text-[#15151a]">{okCount} valid rows</strong>. {errCount} row(s) will be skipped and flagged for correction — they will not be committed.
          </div>

          <div className="border border-[#e7e9f3] rounded-xl bg-[#f9fafc] p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5d6274]">Rows to import</span>
              <strong className="text-[#15151a]">{okCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d6274]">Rows with errors (skipped)</span>
              <strong className="text-[#c8382f]">{errCount}</strong>
            </div>
          </div>

          {duplicateJob && (
            <div className="bg-[#fff2ef] text-[#c8432c] rounded-xl p-3.5 mt-3.5 text-xs">
              ⚠️ {pharmacy.name} already has a committed inventory upload for {CURRENT_PERIOD} ({duplicateJob.rowCount} rows, committed {duplicateJob.committedAt}). This looks like a duplicate.
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

export default function InventoryCsvModal({
  isOpen,
  onClose,
  pharmacy,
}: InventoryCsvModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[640px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
            Import Inventory CSV
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <InventoryCsvWizard
            key={`csv-wizard-${pharmacy.id}-${CURRENT_PERIOD}`}
            pharmacy={pharmacy}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
