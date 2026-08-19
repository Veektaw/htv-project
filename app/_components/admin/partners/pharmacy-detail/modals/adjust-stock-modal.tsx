"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { usePartners } from "../../contexts/partners-context";
import { Product } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type AdjustStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

export default function AdjustStockModal({
  isOpen,
  onClose,
  product,
}: AdjustStockModalProps) {
  const { adjustStock } = usePartners();
  const [change, setChange] = useState<string>("");
  const [reason, setReason] = useState("Restock");

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numChange = Number(change);
    if (!numChange || isNaN(numChange)) {
      showErrorToast("Please enter a valid non-zero adjustment amount");
      return;
    }

    adjustStock(product.id, numChange, reason, "Admin");
    setChange("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] overflow-y-auto sm:max-w-137.5"
      >
        <DialogHeader>
          <DialogTitle className="text-RangoonGreen text-xl font-bold">
            Adjust Stock — {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="border-Iron bg-GhostWhite rounded-xl border p-4 text-xs">
          <p className="text-MistBlue">Current Inventory Level</p>
          <p className="text-RangoonGreen text-xl font-extrabold">
            {product.qty.toLocaleString()} {product.unit}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-CloudyGrey text-xs font-bold">
                Quantity Change (+ or -)*
              </Label>
              <Input
                type="number"
                value={change}
                onChange={(e) => setChange(e.target.value)}
                placeholder="e.g. 100 or -20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-CloudyGrey text-xs font-bold">
                Reason*
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restock">Restock</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Correction">Correction</SelectItem>
                  <SelectItem value="Sold — order">Sold — order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* History table */}
          <div className="space-y-2 pt-2">
            <h4 className="text-RangoonGreen text-xs font-bold">
              Stock Adjustment History
            </h4>
            <div className="border-Iron max-h-48 overflow-y-auto rounded-xl border bg-white">
              <table className="w-full text-left text-xs">
                <thead className="text-CloudyGrey sticky top-0 bg-[#eef0f7] font-bold tracking-wider uppercase">
                  <tr>
                    <th className="px-3.5 py-2.5">Date</th>
                    <th className="px-3.5 py-2.5">Change</th>
                    <th className="px-3.5 py-2.5">Reason</th>
                    <th className="px-3.5 py-2.5">By</th>
                  </tr>
                </thead>
                <tbody className="divide-Iron divide-y">
                  {(product.stockLog || [])
                    .slice()
                    .reverse()
                    .map((log, i) => (
                      <tr key={i} className="hover:bg-GhostWhite">
                        <td className="text-MistBlue px-3.5 py-2">
                          {log.date}
                        </td>
                        <td
                          className={`px-3.5 py-2 font-bold ${
                            log.change >= 0
                              ? "text-[#1f9254]"
                              : "text-[#c8382f]"
                          }`}
                        >
                          {log.change >= 0 ? `+${log.change}` : log.change}
                        </td>
                        <td className="text-RangoonGreen px-3.5 py-2 font-medium">
                          {log.reason}
                        </td>
                        <td className="text-MistBlue px-3.5 py-2">{log.by}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full px-5 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-RangoonGreen rounded-full px-6 font-bold text-white hover:bg-black"
            >
              Apply Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
