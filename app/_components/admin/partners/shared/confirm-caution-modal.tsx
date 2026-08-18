"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

type ConfirmCautionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "dark";
};

export default function ConfirmCautionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
}: ConfirmCautionModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-[520px] rounded-[24px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2 text-left">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] leading-snug">
            {title}
          </DialogTitle>
          <div className="text-xs text-[#5d6274] leading-relaxed pt-2">
            {description}
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
              variant === "danger"
                ? "bg-[#c8382f] hover:bg-[#a92b23]"
                : "bg-[#15151a] hover:bg-black"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
