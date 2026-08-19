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
      <DialogContent
        aria-describedby={undefined}
        className="w-full rounded-[24px] border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-130"
      >
        <DialogHeader className="pb-2 text-left">
          <DialogTitle className="text-xl leading-snug font-extrabold text-[#15151a]">
            {title}
          </DialogTitle>
          <div className="pt-2 text-xs leading-relaxed text-[#5d6274]">
            {description}
          </div>
        </DialogHeader>

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
            onClick={handleConfirm}
            className={`cursor-pointer rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors ${
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
