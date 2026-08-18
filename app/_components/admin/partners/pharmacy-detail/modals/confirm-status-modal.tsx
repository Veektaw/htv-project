"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Pharmacy } from "@/types/partners";

type ConfirmStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pharmacy: Pharmacy;
};

export default function ConfirmStatusModal({
  isOpen,
  onClose,
  onConfirm,
  pharmacy,
}: ConfirmStatusModalProps) {
  const isDeactivating = pharmacy.status === "active";

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-[520px] rounded-[24px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2 text-left">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] leading-snug">
            Are you sure you want to {isDeactivating ? "deactivate" : "reactivate"}{" "}
            <span className="text-PortlandOrange">{pharmacy.name}</span>?
          </DialogTitle>
          <div className="text-xs text-[#5d6274] leading-relaxed pt-2">
            {isDeactivating
              ? "Deactivating this pharmacy will immediately suspend its active operations and restrict portal access for its staff. All historical data, products, orders, and invoices will be safely retained and can be reactivated at any time."
              : "Reactivating this pharmacy will immediately restore its active operational status, re-enable portal access for its team, and include it in upcoming reconciliation cycles."}
          </div>
        </DialogHeader>

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
            onClick={handleConfirm}
            className={`rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors ${
              isDeactivating
                ? "bg-[#c8382f] hover:bg-[#a92b23]"
                : "bg-[#15151a] hover:bg-black"
            }`}
          >
            {isDeactivating ? "Deactivate Pharmacy" : "Reactivate Pharmacy"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
