"use client";

import { usePartners } from "../contexts/partners-context";
import PharmacyDashboard from "@/app/_components/pharmacy/pharmacy-dashboard";

/**
 * @deprecated The Pharmacy Portal has been migrated to a first-class role-based portal at `/pharmacy/dashboard`.
 * This component delegates directly to the new `PharmacyDashboard`.
 */
export default function PortalDashboard() {
  const { pharmacies, portalPharmacyId } = usePartners();
  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];

  if (!ph) return null;

  return <PharmacyDashboard />;
}
