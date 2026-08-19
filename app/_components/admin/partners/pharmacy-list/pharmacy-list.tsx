"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical } from "lucide-react";
import { usePartners } from "../contexts/partners-context";
import { Pharmacy } from "@/types/partners";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddPharmacyModal from "./modals/add-pharmacy-modal";
import ConfirmStatusModal from "../pharmacy-detail/modals/confirm-status-modal";
import ConfirmCautionModal from "../shared/confirm-caution-modal";

export default function PharmacyList() {
  const router = useRouter();
  const { pharmacies, users, products, togglePharmacyStatus, deletePharmacy } =
    usePartners();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [statusTargetPharmacy, setStatusTargetPharmacy] =
    useState<Pharmacy | null>(null);
  const [deleteTargetPharmacy, setDeleteTargetPharmacy] =
    useState<Pharmacy | null>(null);

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pharmacies, searchQuery, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Page Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-RangoonGreen text-2xl font-extrabold tracking-tight">
          Pharmacies
        </h1>
        <Button
          onClick={() => {
            setEditingPharmacy(null);
            setIsAddModalOpen(true);
          }}
          className="bg-RangoonGreen cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
        >
          + Add Pharmacy
        </Button>
      </div>

      {/* Table Card Container */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)]">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="border-border-strong text-MistBlue flex min-w-65 flex-1 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm sm:max-w-xs">
            <Search className="text-MistBlue size-4 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pharmacies"
              className="text-RangoonGreen placeholder:text-MistBlue w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-border-strong text-RangoonGreen cursor-pointer rounded-full border bg-white px-4 py-2 text-xs font-bold outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#eef0f7] text-xs font-bold text-[#5d6274]">
                <th className="px-5 py-3.5">
                  Name <span className="text-MistBlue ml-1 text-[11px]">⇅</span>
                </th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Fulfillment</th>
                <th className="px-5 py-3.5">Users</th>
                <th className="px-5 py-3.5">Products</th>
                <th className="px-5 py-3.5">
                  Status{" "}
                  <span className="text-MistBlue ml-1 text-[11px]">⇅</span>
                </th>
                <th className="w-12 px-5 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredPharmacies.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-MistBlue py-12 text-center text-sm"
                  >
                    No pharmacies match your search.
                  </td>
                </tr>
              ) : (
                filteredPharmacies.map((ph) => {
                  const userCount = users.filter(
                    (u) => u.pharmacyId === ph.id,
                  ).length;
                  const prodCount = products.filter(
                    (p) => p.pharmacyId === ph.id,
                  ).length;

                  return (
                    <tr
                      key={ph.id}
                      onClick={() => router.push(`/admin/partners/${ph.id}`)}
                      className="cursor-pointer transition-colors hover:bg-[#fafbff]"
                    >
                      <td className="text-RangoonGreen px-5 py-4 font-bold">
                        {ph.name}
                      </td>
                      <td className="text-RangoonGreen px-5 py-4 text-sm">
                        {ph.city}, {ph.country}
                      </td>
                      <td className="text-RangoonGreen px-5 py-4 text-sm capitalize">
                        {ph.fulfillment}
                      </td>
                      <td className="text-RangoonGreen px-5 py-4 text-sm font-semibold">
                        {userCount}
                      </td>
                      <td className="text-RangoonGreen px-5 py-4 text-sm font-semibold">
                        {prodCount}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold ${
                            ph.status === "active"
                              ? "bg-[#e1f5ea] text-[#1f9254]"
                              : "bg-[#fbe2e1] text-[#c8382f]"
                          }`}
                        >
                          {ph.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td
                        className="px-5 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-MistBlue hover:text-RangoonGreen size-8 rounded-full hover:bg-gray-100"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-border w-36 rounded-xl shadow-lg"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/partners/${ph.id}`)
                              }
                              className="cursor-pointer py-2 text-xs font-semibold"
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPharmacy(ph);
                                setIsAddModalOpen(true);
                              }}
                              className="cursor-pointer py-2 text-xs font-semibold"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setStatusTargetPharmacy(ph)}
                              className="cursor-pointer py-2 text-xs font-semibold"
                            >
                              {ph.status === "active"
                                ? "Deactivate"
                                : "Reactivate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetPharmacy(ph)}
                              className="text-ChiliPepper cursor-pointer py-2 text-xs font-semibold hover:bg-red-50"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="border-border flex items-center gap-2 border-t px-5 py-4">
          <span className="bg-RangoonGreen flex size-7.5 items-center justify-center rounded-lg text-xs font-bold text-white">
            1
          </span>
          <span className="text-MistBlue text-xs">of 1 page</span>
        </div>
      </div>

      <AddPharmacyModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPharmacy(null);
        }}
        editingPharmacy={editingPharmacy}
      />

      {statusTargetPharmacy && (
        <ConfirmStatusModal
          isOpen={Boolean(statusTargetPharmacy)}
          onClose={() => setStatusTargetPharmacy(null)}
          onConfirm={() => togglePharmacyStatus(statusTargetPharmacy.id)}
          pharmacy={statusTargetPharmacy}
        />
      )}

      {deleteTargetPharmacy && (
        <ConfirmCautionModal
          isOpen={Boolean(deleteTargetPharmacy)}
          onClose={() => setDeleteTargetPharmacy(null)}
          onConfirm={() => deletePharmacy(deleteTargetPharmacy.id)}
          title={`Are you sure you want to delete ${deleteTargetPharmacy.name}?`}
          description="This action will permanently delete this pharmacy from the system. Associated users, orders, and products will no longer be active."
          confirmLabel="Delete Pharmacy"
          variant="danger"
        />
      )}
    </div>
  );
}
