"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners } from "../../contexts/partners-context";
import { FeeTier } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type AddFeeTierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingTier?: FeeTier | null;
};

function FeeTierForm({
  editingTier,
  onClose,
}: {
  editingTier?: FeeTier | null;
  onClose: () => void;
}) {
  const { addFeeTier, updateFeeTier } = usePartners();

  const [min, setMin] = useState<string>(
    editingTier ? String(editingTier.min) : ""
  );
  const [max, setMax] = useState<string>(
    editingTier && editingTier.max !== null ? String(editingTier.max) : ""
  );
  const [rate, setRate] = useState<string>(
    editingTier ? String(editingTier.rate) : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numMin = Number(min) || 0;
    const numMax = max.trim() ? Number(max) : null;
    const numRate = Number(rate) || 0;

    if (numMax !== null && numMax <= numMin) {
      showErrorToast("Maximum volume must be greater than minimum volume");
      return;
    }

    if (editingTier) {
      updateFeeTier(editingTier.id, { min: numMin, max: numMax, rate: numRate });
    } else {
      addFeeTier({ min: numMin, max: numMax, rate: numRate });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Volume Min (units)*
          </label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="0"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Volume Max (units, blank = unbounded)
          </label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Rate (%)*
          </label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.00"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
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
          Submit
        </button>
      </div>
    </form>
  );
}

export default function AddFeeTierModal({
  isOpen,
  onClose,
  editingTier,
}: AddFeeTierModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[580px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
            {editingTier ? "Edit Fee Tier" : "New Fee Tier"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <FeeTierForm
            key={editingTier?.id || "new-tier"}
            editingTier={editingTier}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
