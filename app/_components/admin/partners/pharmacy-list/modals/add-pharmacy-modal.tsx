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
  Pharmacy,
  FulfillmentType,
  FeeType,
  CadenceType,
  PharmacyStatus,
} from "@/types/partners";
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
    editingPharmacy?.status || "active",
  );
  const [city, setCity] = useState(editingPharmacy?.city || "");
  const [country, setCountry] = useState(editingPharmacy?.country || "Nigeria");
  const [email, setEmail] = useState(editingPharmacy?.email || "");
  const [phone, setPhone] = useState(editingPharmacy?.phone || "");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>(
    editingPharmacy?.fulfillment || "delivery",
  );
  const [feeType, setFeeType] = useState<FeeType>(
    editingPharmacy?.feeType || "volume_based",
  );
  const [flatFeeAmount, setFlatFeeAmount] = useState<string>(
    editingPharmacy?.flatFeeAmount ? String(editingPharmacy.flatFeeAmount) : "",
  );
  const [cadence, setCadence] = useState<CadenceType>(
    editingPharmacy?.cadence || "monthly",
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
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Pharmacy Name*
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type in pharmacy name"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
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
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Fulfillment Type*
          </label>
          <select
            value={fulfillment}
            onChange={(e) => setFulfillment(e.target.value as FulfillmentType)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
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
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
          >
            <option value="volume_based">Volume-based (tiered schedule)</option>
            <option value="flat">Flat fee</option>
          </select>
        </div>

        {feeType === "flat" && (
          <div className="col-span-1 space-y-1.5 sm:col-span-2">
            <label className="block text-[12.5px] font-bold text-[#5d6274]">
              Flat Fee Amount (€/month)*
            </label>
            <input
              type="number"
              step="0.01"
              value={flatFeeAmount}
              onChange={(e) => setFlatFeeAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
              required
            />
          </div>
        )}

        <div className="col-span-1 space-y-1.5 sm:col-span-2">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Inventory Upload Cadence*
          </label>
          <select
            value={cadence}
            onChange={(e) => setCadence(e.target.value as CadenceType)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Biweekly</option>
          </select>
          <p className="text-[11px] text-[#8c91a4]">
            How often this pharmacy uploads its inventory and orders-fulfilled
            CSVs.
          </p>
        </div>
      </div>

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
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-full overflow-y-auto rounded-4xl border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-155"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-left text-xl font-extrabold text-[#15151a]">
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
