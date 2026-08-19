"use client";

import { usePartners } from "../admin/partners/contexts/partners-context";
import PharmacyHeader from "./pharmacy-header";
import InvoicesTab from "../admin/partners/pharmacy-detail/tabs/invoices-tab";

export default function PharmacyInvoicesView() {
  const { pharmacies, portalPharmacyId } = usePartners();
  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];

  if (!ph) return null;

  return (
    <div className="space-y-4">
      <PharmacyHeader />
      <InvoicesTab pharmacy={ph} portalMode />
    </div>
  );
}
