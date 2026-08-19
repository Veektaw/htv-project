"use client";

import { useState } from "react";
import { usePartners } from "../contexts/partners-context";
import { FeeTier } from "@/types/partners";
import { Button } from "@/app/_components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddFeeTierModal from "./modals/add-fee-tier-modal";
import ConfirmCautionModal from "../shared/confirm-caution-modal";

export default function PlatformFees() {
  const { feeTiers, deleteFeeTier, pharmacies } = usePartners();
  const [isAddTierOpen, setIsAddTierOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<FeeTier | null>(null);
  const [deleteTargetTier, setDeleteTargetTier] = useState<FeeTier | null>(null);

  const flatFeePharmacies = pharmacies.filter((p) => p.feeType === "flat");

  return (
    <div className="space-y-5">
      {/* Page Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-RangoonGreen text-2xl font-extrabold tracking-tight">
            Platform Fee Schedule
          </h1>
          <span className="bg-[#fdf3d8] text-[#a9790a] rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide">
            TIERS UNCONFIRMED
          </span>
        </div>

        <Button
          onClick={() => {
            setEditingTier(null);
            setIsAddTierOpen(true);
          }}
          className="bg-RangoonGreen hover:bg-black rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
        >
          + Add Tier
        </Button>
      </div>

      {/* Info Card */}
      <div className="border-border bg-white rounded-2xl border p-6 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] text-xs text-MistBlue leading-relaxed">
        Fees are tiered by volume of medication sold and applied to HTV → Pharmacy invoices as an itemized &quot;Platform fee&quot; line. The bands and rates below are <strong>placeholder values</strong> — confirm with the stakeholder before this schedule is used to generate real invoices. <strong>Per the concept doc,</strong> this schedule only applies to pharmacies on the &quot;Volume-based&quot; fee type — pharmacies on &quot;Flat fee&quot; ({flatFeePharmacies.map((p) => p.name).join(", ") || "none"}) use their own flat amount instead, set on the pharmacy record.
      </div>

      {/* Main Table Card */}
      <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#eef0f7] text-[#5d6274] text-xs font-bold">
                <th className="px-5 py-3.5">Volume band (units sold / month)</th>
                <th className="px-5 py-3.5">Rate</th>
                <th className="px-5 py-3.5 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {feeTiers.map((t) => (
                <tr key={t.id} className="hover:bg-[#fafbff] transition-colors">
                  <td className="px-5 py-4 font-bold text-RangoonGreen text-sm">
                    {t.min.toLocaleString()} –{" "}
                    {t.max !== null ? `${t.max.toLocaleString()} units` : "∞ units"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-RangoonGreen text-sm">
                    {t.rate}%
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-MistBlue hover:bg-gray-100 hover:text-RangoonGreen"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border-border">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingTier(t);
                            setIsAddTierOpen(true);
                          }}
                          className="cursor-pointer text-xs font-semibold py-2"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTargetTier(t)}
                          className="text-ChiliPepper cursor-pointer text-xs font-semibold py-2 hover:bg-red-50"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddFeeTierModal
        isOpen={isAddTierOpen}
        onClose={() => {
          setIsAddTierOpen(false);
          setEditingTier(null);
        }}
        editingTier={editingTier}
      />

      {deleteTargetTier && (
        <ConfirmCautionModal
          isOpen={Boolean(deleteTargetTier)}
          onClose={() => setDeleteTargetTier(null)}
          onConfirm={() => deleteFeeTier(deleteTargetTier.id)}
          title={`Are you sure you want to delete this fee tier (${deleteTargetTier.min.toLocaleString()} – ${
            deleteTargetTier.max !== null
              ? `${deleteTargetTier.max.toLocaleString()} units`
              : "∞"
          })?`}
          description="This action will delete this volume tier from the platform fee schedule. Any future invoices calculated from volume tiers will use the updated schedule."
          confirmLabel="Delete Tier"
          variant="danger"
        />
      )}
    </div>
  );
}
