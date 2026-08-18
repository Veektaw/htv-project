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
        : [{ desc: "", qty: null, unitPrice: null, amount: 0, type: "product" }];
    });
  };

  const handleLineChange = (
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number | null
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Month*
          </label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="July, 2026"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
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
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="under_review">Under Review</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Dynamic Line Items */}
      <div>
        <div className="text-[#8c91a4] font-bold text-xs mt-3.5 mb-2">
          Line items
        </div>

        <div className="space-y-2">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={line.desc}
                onChange={(e) =>
                  handleLineChange(idx, "desc", e.target.value)
                }
                placeholder="Description"
                className="flex-2 min-w-0 h-10 px-3 border border-[#d8dcee] rounded-lg text-xs text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
                required
              />

              <input
                type="number"
                value={line.qty === null ? "" : line.qty}
                onChange={(e) =>
                  handleLineChange(idx, "qty", e.target.value)
                }
                placeholder="Qty"
                className="w-[70px] shrink-0 h-10 px-3 border border-[#d8dcee] rounded-lg text-xs text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
              />

              <input
                type="number"
                step="0.01"
                value={line.unitPrice === null ? "" : line.unitPrice}
                onChange={(e) =>
                  handleLineChange(idx, "unitPrice", e.target.value)
                }
                placeholder="Unit price"
                className="w-[100px] shrink-0 h-10 px-3 border border-[#d8dcee] rounded-lg text-xs text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
              />

              <input
                type="number"
                step="0.01"
                value={line.amount || ""}
                onChange={(e) =>
                  handleLineChange(idx, "amount", e.target.value)
                }
                placeholder="Amount"
                className="w-[100px] shrink-0 h-10 px-3 border border-[#d8dcee] rounded-lg text-xs font-bold text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
                required
              />

              <button
                type="button"
                onClick={() => handleRemoveLine(idx)}
                className="size-10 shrink-0 flex items-center justify-center rounded-lg border border-[#d8dcee] bg-white hover:bg-gray-50 text-base text-[#15151a] cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLine}
          className="mt-2 inline-flex items-center rounded-full border border-[#d8dcee] bg-white px-3.5 py-1.5 text-xs font-bold text-[#15151a] hover:bg-gray-50 cursor-pointer"
        >
          + Add Line Item
        </button>

        <div className="text-right mt-3.5 font-extrabold text-sm text-[#15151a]">
          Total: <span>€{totalAmount % 1 === 0 ? totalAmount.toLocaleString() : totalAmount.toFixed(2)}</span>
        </div>
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
          type="submit"
          className="rounded-full px-6 py-2.5 text-xs font-bold text-white bg-[#15151a] hover:bg-black cursor-pointer shadow-xs"
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
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[640px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
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
