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

  const duplicateJob = checkDuplicateJob(
    pharmacy.id,
    "inventory",
    CURRENT_PERIOD,
  );
  const okRows = MOCK_INVENTORY_PREVIEW.filter((r) => r.status === "ok");
  const errRows = MOCK_INVENTORY_PREVIEW.filter((r) => r.status === "error");
  const okCount = okRows.length;
  const errCount = errRows.length;

  const handleCommit = () => {
    commitInventoryCsv(pharmacy.id, CURRENT_PERIOD, okCount);
    onClose();
  };

  const cadenceLabel = pharmacy.cadence === "biweekly" ? "Biweekly" : "Monthly";

  return (
    <div className="space-y-4 pt-1">
      {/* Steps bar */}
      <div className="mb-5 flex gap-0">
        <div
          className={`flex-1 border-b-[3px] pb-2.5 text-center text-xs font-bold transition-colors ${
            step > 1
              ? "border-[#1f9254] text-[#1f9254]"
              : step === 1
                ? "border-[#f15b41] text-[#f15b41]"
                : "border-[#e7e9f3] text-[#8c91a4]"
          }`}
        >
          1. Upload
        </div>
        <div
          className={`flex-1 border-b-[3px] pb-2.5 text-center text-xs font-bold transition-colors ${
            step > 2
              ? "border-[#1f9254] text-[#1f9254]"
              : step === 2
                ? "border-[#f15b41] text-[#f15b41]"
                : "border-[#e7e9f3] text-[#8c91a4]"
          }`}
        >
          2. Map &amp; Validate
        </div>
        <div
          className={`flex-1 border-b-[3px] pb-2.5 text-center text-xs font-bold transition-colors ${
            step === 3
              ? "border-[#f15b41] text-[#f15b41]"
              : "border-[#e7e9f3] text-[#8c91a4]"
          }`}
        >
          3. Preview &amp; Commit
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div>
          <div className="rounded-2xl border-2 border-dashed border-[#d8dcee] bg-[#fafbff] p-10 text-center text-[#5d6274]">
            <div className="mb-2.5 text-[28px]">📁</div>
            <p className="text-[13.5px]">
              <strong className="text-[#15151a]">
                Drag and drop your CSV file here
              </strong>
              , or click to browse.
            </p>
            <p className="mt-1 text-xs text-[#8c91a4]">
              Columns expected: Name, Quantity, Unit, Batch ID, Pharmaceutical
              ID, Barcode ID, Manufacturer Price, Pharmaceutical Price, HTV
              Price.
            </p>
          </div>

          <div className="mt-3 text-xs text-[#8c91a4]">
            Cadence for this pharmacy:{" "}
            <strong className="text-[#15151a]">{cadenceLabel}</strong> — set on
            the pharmacy&apos;s Edit form.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#d8dcee] bg-white px-5 py-2.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
            >
              Simulate Upload → inventory_july.csv
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Map & Validate */}
      {step === 2 && (
        <div>
          <div className="mb-3 text-xs text-[#8c91a4]">
            Column mapping detected automatically from headers. {errCount}{" "}
            row(s) need attention before this batch can be committed.
          </div>

          <div className="overflow-hidden rounded-xl border border-[#e7e9f3]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#eef0f7] font-bold text-[#5d6274]">
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
                    <td className="px-3.5 py-3 font-medium text-[#8c91a4]">
                      {r.row}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-[#15151a]">
                      {r.name || <span className="text-[#c8382f]">—</span>}
                    </td>
                    <td className="px-3.5 py-3 text-[#15151a]">{r.qty}</td>
                    <td className="px-3.5 py-3 text-[#15151a]">{r.unit}</td>
                    <td className="px-3.5 py-3 font-mono text-[#15151a]">
                      {r.batchId}
                    </td>
                    <td className="px-3.5 py-3">
                      {r.status === "ok" ? (
                        <span className="inline-flex items-center rounded-full bg-[#e1f5ea] px-2.5 py-0.5 text-[11px] font-bold text-[#1f9254]">
                          Valid
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center rounded-full bg-[#fbe2e1] px-2.5 py-0.5 text-[11px] font-bold text-[#c8382f]">
                            Error
                          </span>
                          {r.error && (
                            <div className="mt-0.5 text-[10px] text-[#c8382f]">
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
              className="cursor-pointer rounded-full border border-[#d8dcee] bg-white px-5 py-2.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
            >
              Continue to Preview ({okCount} valid)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Commit */}
      {step === 3 && (
        <div>
          <div className="mb-3 text-xs text-[#8c91a4]">
            Ready to commit{" "}
            <strong className="text-[#15151a]">{okCount} valid rows</strong>.{" "}
            {errCount} row(s) will be skipped and flagged for correction — they
            will not be committed.
          </div>

          <div className="space-y-2 rounded-xl border border-[#e7e9f3] bg-[#f9fafc] p-4 text-xs">
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
            <div className="mt-3.5 rounded-xl bg-[#fff2ef] p-3.5 text-xs text-[#c8432c]">
              ⚠️ {pharmacy.name} already has a committed inventory upload for{" "}
              {CURRENT_PERIOD} ({duplicateJob.rowCount} rows, committed{" "}
              {duplicateJob.committedAt}). This looks like a duplicate.
              <label className="mt-2 flex cursor-pointer items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={confirmedDuplicate}
                  onChange={(e) => setConfirmedDuplicate(e.target.checked)}
                  className="accent-PortlandOrange size-3.5 rounded"
                />
                <span>Yes, re-upload and replace it anyway</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="cursor-pointer rounded-full border border-[#d8dcee] bg-white px-5 py-2.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={Boolean(duplicateJob && !confirmedDuplicate)}
              onClick={handleCommit}
              className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
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
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-full overflow-y-auto rounded-4xl border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-160"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-left text-xl font-extrabold text-[#15151a]">
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
