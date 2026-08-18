"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { usePartners } from "../contexts/partners-context";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import OverviewTab from "./tabs/overview-tab";
import UsersTab from "./tabs/users-tab";
import ProductsTab from "./tabs/products-tab";
import InvoicesTab from "./tabs/invoices-tab";
import AddPharmacyModal from "../pharmacy-list/modals/add-pharmacy-modal";
import ConfirmStatusModal from "./modals/confirm-status-modal";

type PharmacyDetailProps = {
  pharmacyId: string;
};

export default function PharmacyDetail({ pharmacyId }: PharmacyDetailProps) {
  const { pharmacies, togglePharmacyStatus } = usePartners();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "products" | "invoices">("overview");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);

  const ph = pharmacies.find((p) => p.id === pharmacyId);

  if (!ph) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-8">
        <p className="text-MistBlue text-base font-bold">Pharmacy not found</p>
        <Link
          href="/admin/partners"
          className="text-PortlandOrange mt-2 text-xs font-bold hover:underline"
        >
          ← Back to Pharmacies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="text-MistBlue text-xs font-semibold">
        <Link
          href="/admin/partners"
          className="text-PortlandOrange hover:underline font-bold"
        >
          Pharmacies
        </Link>{" "}
        / {ph.name}
      </nav>

      {/* Main Container Card */}
      <div className="border-border bg-white rounded-2xl border shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] overflow-hidden">
        {/* Detail Header */}
        <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-RangoonGreen text-2xl font-extrabold tracking-tight">
                {ph.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold ${
                  ph.status === "active"
                    ? "bg-[#e1f5ea] text-[#1f9254]"
                    : "bg-[#fbe2e1] text-[#c8382f]"
                }`}
              >
                {ph.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-MistBlue mt-1 text-xs">
              {ph.city}, {ph.country} · {ph.fulfillment === "delivery" ? "Delivery" : "Pickup"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="border-border-strong rounded-full px-5 py-2.5 text-xs font-bold text-RangoonGreen hover:bg-gray-50 cursor-pointer"
            >
              Edit Pharmacy
            </Button>

            <button
              type="button"
              onClick={() => setIsConfirmStatusOpen(true)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors ${
                ph.status === "active"
                  ? "bg-[#c8382f] hover:bg-[#a92b23]"
                  : "bg-RangoonGreen hover:bg-black"
              }`}
            >
              {ph.status === "active" ? "Deactivate" : "Reactivate"} Pharmacy
            </button>
          </div>
        </div>

        {/* Collapsible Info Accordion */}
        <div className="border-border mx-6 mb-4 overflow-hidden rounded-xl border">
          <button
            type="button"
            onClick={() => setIsAccordionOpen((prev) => !prev)}
            className="bg-[#5a5f6e] flex w-full items-center justify-between px-5 py-3 text-xs font-bold text-white transition-opacity hover:opacity-95 cursor-pointer"
          >
            <span>Pharmacy Info</span>
            {isAccordionOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>

          {isAccordionOpen && (
            <div className="grid grid-cols-1 gap-4 bg-white p-5 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Name
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium">
                  {ph.name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Status
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium capitalize">
                  {ph.status}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Location
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium">
                  {ph.city}, {ph.country}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Fulfillment Type
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium capitalize">
                  {ph.fulfillment === "delivery" ? "Delivery" : "Pickup"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Contact Email
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium">
                  {ph.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Contact Phone
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium">
                  {ph.phone || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Platform Fee
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium">
                  {ph.feeType === "flat"
                    ? `Flat fee — €${ph.flatFeeAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}/mo`
                    : "Volume-based (tiered schedule)"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-MistBlue text-[11px] font-bold">
                  Upload Cadence
                </span>
                <p className="text-RangoonGreen bg-[#f9fafc] border-border rounded-lg border px-3.5 py-2.5 font-medium capitalize">
                  {ph.cadence === "monthly" ? "Monthly" : "Biweekly"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex gap-2 border-b px-6 pt-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "border-b-2 px-4 py-3 transition-colors cursor-pointer",
              activeTab === "overview"
                ? "border-PortlandOrange text-RangoonGreen"
                : "border-transparent text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={cn(
              "border-b-2 px-4 py-3 transition-colors cursor-pointer",
              activeTab === "users"
                ? "border-PortlandOrange text-RangoonGreen"
                : "border-transparent text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={cn(
              "border-b-2 px-4 py-3 transition-colors cursor-pointer",
              activeTab === "products"
                ? "border-PortlandOrange text-RangoonGreen"
                : "border-transparent text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Products / Inventory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={cn(
              "border-b-2 px-4 py-3 transition-colors cursor-pointer",
              activeTab === "invoices"
                ? "border-PortlandOrange text-RangoonGreen"
                : "border-transparent text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Invoices
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6">
          {activeTab === "overview" && <OverviewTab pharmacy={ph} />}
          {activeTab === "users" && <UsersTab pharmacy={ph} />}
          {activeTab === "products" && <ProductsTab pharmacy={ph} />}
          {activeTab === "invoices" && <InvoicesTab pharmacy={ph} />}
        </div>
      </div>

      <AddPharmacyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingPharmacy={ph}
      />

      <ConfirmStatusModal
        isOpen={isConfirmStatusOpen}
        onClose={() => setIsConfirmStatusOpen(false)}
        onConfirm={() => togglePharmacyStatus(ph.id)}
        pharmacy={ph}
      />
    </div>
  );
}
