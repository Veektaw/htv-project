"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners } from "../../contexts/partners-context";
import { Pharmacy, FulfillmentType, FeeType, CadenceType, PharmacyStatus } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type AddPharmacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPharmacy?: Pharmacy | null;
};

function PharmacyForm({
  editingPharmacy,
  onClose,
}: {
  editingPharmacy?: Pharmacy | null;
  onClose: () => void;
}) {
  const { addPharmacy, updatePharmacy } = usePartners();

  const [name, setName] = useState(editingPharmacy?.name || "");
  const [status, setStatus] = useState<PharmacyStatus>(
    editingPharmacy?.status || "active"
  );
  const [city, setCity] = useState(editingPharmacy?.city || "");
  const [country, setCountry] = useState(editingPharmacy?.country || "Nigeria");
  const [email, setEmail] = useState(editingPharmacy?.email || "");
  const [phone, setPhone] = useState(editingPharmacy?.phone || "");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>(
    editingPharmacy?.fulfillment || "delivery"
  );
  const [feeType, setFeeType] = useState<FeeType>(
    editingPharmacy?.feeType || "volume_based"
  );
  const [flatFeeAmount, setFlatFeeAmount] = useState<string>(
    editingPharmacy?.flatFeeAmount ? String(editingPharmacy.flatFeeAmount) : ""
  );
  const [cadence, setCadence] = useState<CadenceType>(
    editingPharmacy?.cadence || "monthly"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showErrorToast("Pharmacy name is required");
      return;
    }
    if (!city.trim() || !country.trim()) {
      showErrorToast("City and Country are required");
      return;
    }
    if (!email.trim()) {
      showErrorToast("Contact email is required");
      return;
    }

    const payload = {
      name: name.trim(),
      status,
      city: city.trim(),
      country: country.trim(),
      email: email.trim(),
      phone: phone.trim(),
      fulfillment,
      feeType,
      flatFeeAmount: feeType === "flat" ? Number(flatFeeAmount) || 0 : null,
      cadence,
    };

    if (editingPharmacy) {
      updatePharmacy(editingPharmacy.id, payload);
    } else {
      addPharmacy(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Pharmacy Name*
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type in pharmacy name"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Status*
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PharmacyStatus)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            City*
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Lagos"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Country*
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Nigeria"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Contact Email*
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@pharmacy.com"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Contact Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 801 234 5678"
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Fulfillment Type*
          </label>
          <select
            value={fulfillment}
            onChange={(e) => setFulfillment(e.target.value as FulfillmentType)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Platform Fee Type*
          </label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value as FeeType)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="volume_based">Volume-based (tiered schedule)</option>
            <option value="flat">Flat fee</option>
          </select>
        </div>

        {feeType === "flat" && (
          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="block text-[12.5px] font-bold text-[#5d6274]">
              Flat Fee Amount (€/month)*
            </label>
            <input
              type="number"
              step="0.01"
              value={flatFeeAmount}
              onChange={(e) => setFlatFeeAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none placeholder:text-[#b3b8c9] focus:border-PortlandOrange"
              required
            />
          </div>
        )}

        <div className="col-span-1 sm:col-span-2 space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Inventory Upload Cadence*
          </label>
          <select
            value={cadence}
            onChange={(e) => setCadence(e.target.value as CadenceType)}
            className="w-full h-11 px-3.5 border border-[#d8dcee] rounded-lg text-[13.5px] text-[#15151a] bg-white outline-none cursor-pointer focus:border-PortlandOrange"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Biweekly</option>
          </select>
          <p className="text-[11px] text-[#8c91a4]">
            How often this pharmacy uploads its inventory and orders-fulfilled CSVs.
          </p>
        </div>
      </div>

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
          {editingPharmacy ? "Save Changes" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default function AddPharmacyModal({
  isOpen,
  onClose,
  editingPharmacy,
}: AddPharmacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full sm:max-w-[620px] rounded-[20px] p-8 bg-white border border-[#e7e9f3] shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-[#15151a] text-left">
            {editingPharmacy ? "Edit Pharmacy" : "New Pharmacy"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <PharmacyForm
            key={editingPharmacy?.id || "new-pharmacy"}
            editingPharmacy={editingPharmacy}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
