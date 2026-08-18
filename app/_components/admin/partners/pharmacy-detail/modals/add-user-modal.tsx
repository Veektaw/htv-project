"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners } from "../../contexts/partners-context";
import { PharmacyUser, PharmacyUserRole, PharmacyUserStatus } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
  editingUser?: PharmacyUser | null;
};

function UserForm({
  pharmacyId,
  editingUser,
  onClose,
}: {
  pharmacyId: string;
  editingUser?: PharmacyUser | null;
  onClose: () => void;
}) {
  const { addUser, updateUser } = usePartners();

  const [title, setTitle] = useState(editingUser?.title || "Mr.");
  const [first, setFirst] = useState(editingUser?.first || "");
  const [last, setLast] = useState(editingUser?.last || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [role, setRole] = useState<PharmacyUserRole>(
    editingUser?.role || "Pharmacy Admin"
  );
  const [status, setStatus] = useState<PharmacyUserStatus>(
    editingUser?.status || "active"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !last.trim()) {
      showErrorToast("First and Last name are required");
      return;
    }
    if (!email.trim()) {
      showErrorToast("Email address is required");
      return;
    }

    const payload = {
      pharmacyId,
      title,
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      role,
      status,
    };

    if (editingUser) {
      updateUser(editingUser.id, payload);
    } else {
      addUser(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* 2-Column Form Grid matching HTML prototype */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 text-xs">
        {/* Row 1 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Title*
          </label>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Dr.">Dr.</option>
            <option value="Miss">Miss</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            First Name*
          </label>
          <input
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="Type in user's first name"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Last Name*
          </label>
          <input
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            placeholder="Type in user's last name"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Email address*
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type in user's email address here"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        {/* Row 3 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Role*
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PharmacyUserRole)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="Pharmacy Admin">Pharmacy Admin</option>
            <option value="Pharmacy Staff">Pharmacy Staff</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Status*
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PharmacyUserStatus)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Modal Actions */}
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

export default function AddUserModal({
  isOpen,
  onClose,
  pharmacyId,
  editingUser,
}: AddUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[580px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
            {editingUser ? "Edit Pharmacy User" : "New Pharmacy User"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <UserForm
            key={editingUser?.id || "new-user"}
            pharmacyId={pharmacyId}
            editingUser={editingUser}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
