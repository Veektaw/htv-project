"use client";

import { useState } from "react";
import { Pharmacy, PharmacyUser } from "@/types/partners";
import { usePartners } from "../../contexts/partners-context";
import { Button } from "@/app/_components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddUserModal from "../modals/add-user-modal";
import ConfirmCautionModal from "../../shared/confirm-caution-modal";

export default function UsersTab({
  pharmacy,
}: {
  pharmacy: Pharmacy;
  portalMode?: boolean;
}) {
  const { users, toggleUserStatus, deleteUser } = usePartners();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PharmacyUser | null>(null);
  const [statusTargetUser, setStatusTargetUser] = useState<PharmacyUser | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<PharmacyUser | null>(null);

  const pharmacyUsers = users.filter((u) => u.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-RangoonGreen text-base font-extrabold">
          Pharmacy Users
        </h3>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsAddUserOpen(true);
          }}
          className="bg-RangoonGreen hover:bg-black rounded-full px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          + Add User
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {pharmacyUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-MistBlue py-8 text-center text-xs">
                  No users yet for this pharmacy.
                </td>
              </tr>
            ) : (
              pharmacyUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#fafbff] transition-colors">
                  <td className="px-5 py-4 font-bold text-RangoonGreen text-sm">
                    {u.title} {u.first} {u.last}
                  </td>
                  <td className="px-5 py-4 text-RangoonGreen text-xs">
                    {u.email}
                  </td>
                  <td className="px-5 py-4 text-RangoonGreen text-xs font-medium">
                    {u.role}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold ${
                        u.status === "active"
                          ? "bg-[#e1f5ea] text-[#1f9254]"
                          : "bg-[#fbe2e1] text-[#c8382f]"
                      }`}
                    >
                      {u.status === "active" ? "Activated" : "Deactivated"}
                    </span>
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
                            setEditingUser(u);
                            setIsAddUserOpen(true);
                          }}
                          className="cursor-pointer text-xs font-semibold py-2"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusTargetUser(u)}
                          className="cursor-pointer text-xs font-semibold py-2"
                        >
                          {u.status === "active" ? "Deactivate" : "Reactivate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTargetUser(u)}
                          className="text-ChiliPepper cursor-pointer text-xs font-semibold py-2 hover:bg-red-50"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => {
          setIsAddUserOpen(false);
          setEditingUser(null);
        }}
        pharmacyId={pharmacy.id}
        editingUser={editingUser}
      />

      {statusTargetUser && (
        <ConfirmCautionModal
          isOpen={Boolean(statusTargetUser)}
          onClose={() => setStatusTargetUser(null)}
          onConfirm={() => toggleUserStatus(statusTargetUser.id)}
          title={`Are you sure you want to ${
            statusTargetUser.status === "active" ? "deactivate" : "reactivate"
          } ${statusTargetUser.first} ${statusTargetUser.last}?`}
          description={
            statusTargetUser.status === "active"
              ? "Deactivating this user will immediately revoke their access to the pharmacy portal. Their historical activity and records will be retained."
              : "Reactivating this user will restore their active portal login access."
          }
          confirmLabel={
            statusTargetUser.status === "active"
              ? "Deactivate User"
              : "Reactivate User"
          }
          variant={statusTargetUser.status === "active" ? "danger" : "dark"}
        />
      )}

      {deleteTargetUser && (
        <ConfirmCautionModal
          isOpen={Boolean(deleteTargetUser)}
          onClose={() => setDeleteTargetUser(null)}
          onConfirm={() => deleteUser(deleteTargetUser.id)}
          title={`Are you sure you want to delete ${deleteTargetUser.first} ${deleteTargetUser.last}?`}
          description="This action will permanently remove this user account from the pharmacy team. This action cannot be undone."
          confirmLabel="Delete User"
          variant="danger"
        />
      )}
    </div>
  );
}
