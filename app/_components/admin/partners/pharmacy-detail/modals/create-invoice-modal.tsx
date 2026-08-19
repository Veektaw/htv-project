"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners, CURRENT_PERIOD } from "../../contexts/partners-context";
import {
  InvoiceDirection,
  InvoiceLineItem,
  PartnerInvoiceStatus,
  Pharmacy,
} from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type CreateInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy;
  initialDirection: InvoiceDirection;
};

function CreateInvoiceForm({
  pharmacy,
  initialDirection,
  onClose,
}: {
  pharmacy: Pharmacy;
  initialDirection: InvoiceDirection;
  onClose: () => void;
}) {
  const { createInvoice } = usePartners();

  const [month, setMonth] = useState(CURRENT_PERIOD);
  const [status, setStatus] = useState<PartnerInvoiceStatus>("under_review");
  const [lines, setLines] = useState<InvoiceLineItem[]>([
    { desc: "", qty: null, unitPrice: null, amount: 0, type: "product" },
  ]);

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      { desc: "", qty: null, unitPrice: null, amount: 0, type: "product" },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length > 0
        ? filtered
        : [
            {
              desc: "",
              qty: null,
              unitPrice: null,
              amount: 0,
              type: "product",
            },
          ];
    });
  };

  const handleLineChange = (
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number | null,
  ) => {
    setLines((prev) => {
      const copy = [...prev];
      const line = { ...copy[index] };

      if (field === "desc") line.desc = String(value);
      if (field === "type") line.type = value as "product" | "platform_fee";
      if (field === "qty") {
        line.qty = value === "" || value === null ? null : Number(value);
        if (line.qty !== null && line.unitPrice !== null) {
          line.amount = line.qty * line.unitPrice;
        }
      }
      if (field === "unitPrice") {
        line.unitPrice = value === "" || value === null ? null : Number(value);
        if (line.qty !== null && line.unitPrice !== null) {
          line.amount = line.qty * line.unitPrice;
        }
      }
      if (field === "amount") {
        line.amount = Number(value) || 0;
      }

      copy[index] = line;
      return copy;
    });
  };

  const totalAmount = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validLines = lines.filter((l) => l.desc.trim().length > 0);
    if (validLines.length === 0) {
      showErrorToast("Please add at least one line item with a description");
      return;
    }

    const invoiceNumber = `HTV-INV-${pharmacy.id.toUpperCase()}-${lines.length + 10}A`;

    createInvoice({
      pharmacyId: pharmacy.id,
      direction: initialDirection,
      number: invoiceNumber,
      month,
      amount: totalAmount,
      status,
      lines: validLines,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* 2-Column Form Grid */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Month*
          </label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="July, 2026"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Status*
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PartnerInvoiceStatus)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
          >
            <option value="under_review">Under Review</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Dynamic Line Items */}
      <div>
        <div className="mt-3.5 mb-2 text-xs font-bold text-[#8c91a4]">
          Line items
        </div>

        <div className="space-y-2">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={line.desc}
                onChange={(e) => handleLineChange(idx, "desc", e.target.value)}
                placeholder="Description"
                className="focus:border-PortlandOrange h-10 min-w-0 flex-2 rounded-lg border border-[#d8dcee] bg-white px-3 text-xs text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
                required
              />

              <input
                type="number"
                value={line.qty === null ? "" : line.qty}
                onChange={(e) => handleLineChange(idx, "qty", e.target.value)}
                placeholder="Qty"
                className="focus:border-PortlandOrange h-10 w-17.5 shrink-0 rounded-lg border border-[#d8dcee] bg-white px-3 text-xs text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
              />

              <input
                type="number"
                step="0.01"
                value={line.unitPrice === null ? "" : line.unitPrice}
                onChange={(e) =>
                  handleLineChange(idx, "unitPrice", e.target.value)
                }
                placeholder="Unit price"
                className="focus:border-PortlandOrange h-10 w-25 shrink-0 rounded-lg border border-[#d8dcee] bg-white px-3 text-xs text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
              />

              <input
                type="number"
                step="0.01"
                value={line.amount || ""}
                onChange={(e) =>
                  handleLineChange(idx, "amount", e.target.value)
                }
                placeholder="Amount"
                className="focus:border-PortlandOrange h-10 w-25 shrink-0 rounded-lg border border-[#d8dcee] bg-white px-3 text-xs font-bold text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
                required
              />

              <button
                type="button"
                onClick={() => handleRemoveLine(idx)}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#d8dcee] bg-white text-base text-[#15151a] hover:bg-gray-50"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLine}
          className="mt-2 inline-flex cursor-pointer items-center rounded-full border border-[#d8dcee] bg-white px-3.5 py-1.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
        >
          + Add Line Item
        </button>

        <div className="mt-3.5 text-right text-sm font-extrabold text-[#15151a]">
          Total:{" "}
          <span>
            €
            {totalAmount % 1 === 0
              ? totalAmount.toLocaleString()
              : totalAmount.toFixed(2)}
          </span>
        </div>
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
          type="submit"
          className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  pharmacy,
  initialDirection,
}: CreateInvoiceModalProps) {
  const directionTitle =
    initialDirection === "htv_to_pharmacy"
      ? `HTV → ${pharmacy.name}`
      : `${pharmacy.name} → HTV`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-full overflow-y-auto rounded-4xl border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-160"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-left text-xl font-extrabold text-[#15151a]">
            New Invoice — {directionTitle}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <CreateInvoiceForm
            key={`create-inv-${pharmacy.id}-${initialDirection}`}
            pharmacy={pharmacy}
            initialDirection={initialDirection}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
