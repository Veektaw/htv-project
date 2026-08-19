"use client";

import { usePartners } from "../admin/partners/contexts/partners-context";
import PharmacyHeader from "./pharmacy-header";
import UsersTab from "../admin/partners/pharmacy-detail/tabs/users-tab";

export default function PharmacyTeamView() {
  const { pharmacies, portalPharmacyId } = usePartners();
  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];

  if (!ph) return null;

  return (
    <div className="space-y-4">
      <PharmacyHeader />
      <UsersTab pharmacy={ph} portalMode />
    </div>
  );
}
