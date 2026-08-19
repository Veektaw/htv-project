"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners } from "../../contexts/partners-context";
import {
  PharmacyUser,
  PharmacyUserRole,
  PharmacyUserStatus,
} from "@/types/partners";
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
    editingUser?.role || "Pharmacy Admin",
  );
  const [status, setStatus] = useState<PharmacyUserStatus>(
    editingUser?.status || "active",
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
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
        {/* Row 1 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Title*
          </label>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
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
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
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
          className="cursor-pointer rounded-full border border-[#d8dcee] bg-white px-5 py-2.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
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
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-full overflow-y-auto rounded-4xl border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-145"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-left text-xl font-extrabold text-[#15151a]">
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
