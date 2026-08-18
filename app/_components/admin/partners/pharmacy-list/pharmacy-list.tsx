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
  const {
    pharmacies,
    users,
    products,
    togglePharmacyStatus,
    deletePharmacy,
  } = usePartners();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [statusTargetPharmacy, setStatusTargetPharmacy] = useState<Pharmacy | null>(null);
  const [deleteTargetPharmacy, setDeleteTargetPharmacy] = useState<Pharmacy | null>(null);

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
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
          className="bg-RangoonGreen hover:bg-black rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
        >
          + Add Pharmacy
        </Button>
      </div>

      {/* Table Card Container */}
      <div className="border-border bg-card rounded-2xl border bg-white shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="border-border-strong flex min-w-[260px] flex-1 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm text-MistBlue sm:max-w-xs">
            <Search className="size-4 text-MistBlue shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pharmacies"
              className="w-full bg-transparent text-sm text-RangoonGreen outline-none placeholder:text-MistBlue"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-border-strong rounded-full border bg-white px-4 py-2 text-xs font-bold text-RangoonGreen outline-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#eef0f7] text-[#5d6274] text-xs font-bold">
                <th className="px-5 py-3.5">
                  Name <span className="text-MistBlue text-[11px] ml-1">⇅</span>
                </th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Fulfillment</th>
                <th className="px-5 py-3.5">Users</th>
                <th className="px-5 py-3.5">Products</th>
                <th className="px-5 py-3.5">
                  Status <span className="text-MistBlue text-[11px] ml-1">⇅</span>
                </th>
                <th className="px-5 py-3.5 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredPharmacies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-MistBlue py-12 text-center text-sm">
                    No pharmacies match your search.
                  </td>
                </tr>
              ) : (
                filteredPharmacies.map((ph) => {
                  const userCount = users.filter(
                    (u) => u.pharmacyId === ph.id
                  ).length;
                  const prodCount = products.filter(
                    (p) => p.pharmacyId === ph.id
                  ).length;

                  return (
                    <tr
                      key={ph.id}
                      onClick={() => router.push(`/admin/partners/${ph.id}`)}
                      className="hover:bg-[#fafbff] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-RangoonGreen">
                        {ph.name}
                      </td>
                      <td className="px-5 py-4 text-RangoonGreen text-sm">
                        {ph.city}, {ph.country}
                      </td>
                      <td className="px-5 py-4 text-RangoonGreen text-sm capitalize">
                        {ph.fulfillment}
                      </td>
                      <td className="px-5 py-4 text-RangoonGreen text-sm font-semibold">
                        {userCount}
                      </td>
                      <td className="px-5 py-4 text-RangoonGreen text-sm font-semibold">
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
                              className="size-8 rounded-full text-MistBlue hover:bg-gray-100 hover:text-RangoonGreen"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border-border">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/partners/${ph.id}`)}
                              className="cursor-pointer text-xs font-semibold py-2"
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPharmacy(ph);
                                setIsAddModalOpen(true);
                              }}
                              className="cursor-pointer text-xs font-semibold py-2"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setStatusTargetPharmacy(ph)}
                              className="cursor-pointer text-xs font-semibold py-2"
                            >
                              {ph.status === "active" ? "Deactivate" : "Reactivate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetPharmacy(ph)}
                              className="text-ChiliPepper cursor-pointer text-xs font-semibold py-2 hover:bg-red-50"
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
        <div className="flex items-center gap-2 px-5 py-4 border-t border-border">
          <span className="size-7.5 bg-RangoonGreen text-white font-bold rounded-lg flex items-center justify-center text-xs">
            1
          </span>
          <span className="text-xs text-MistBlue">of 1 page</span>
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
