"use client";

import { usePartners } from "../admin/partners/contexts/partners-context";
import PharmacyHeader from "./pharmacy-header";
import ProductsTab from "../admin/partners/pharmacy-detail/tabs/products-tab";

export default function PharmacyProductsView() {
  const { pharmacies, portalPharmacyId } = usePartners();
  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];

  if (!ph) return null;

  return (
    <div className="space-y-4">
      <PharmacyHeader />
      <ProductsTab pharmacy={ph} portalMode />
    </div>
  );
}
