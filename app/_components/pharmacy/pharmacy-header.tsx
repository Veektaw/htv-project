"use client";

import { usePathname } from "next/navigation";
import { usePartners } from "../admin/partners/contexts/partners-context";

export default function PharmacyHeader({
  bannerText,
}: {
  bannerText?: string;
}) {
  const pathname = usePathname();
  const { pharmacies, portalPharmacyId } = usePartners();
  const ph =
    pharmacies.find((p) => p.id === portalPharmacyId) || pharmacies[0];

  const defaultBanner = pathname.includes("/dashboard")
    ? `You're viewing ${ph?.name}'s own scoped portal — only this pharmacy's data is visible, mirroring the existing Doctor Portal pattern.`
    : pathname.includes("/invoices")
    ? `${ph?.name}'s own invoices, both directions.`
    : pathname.includes("/team")
    ? `${ph?.name}'s own staff accounts — self-managed, per concept doc §4 ("presumably by pharmacy admins within their own portal").`
    : `${ph?.name}'s own product catalog. HTV markup is only shown where the admin has made it visible.`;

  return (
    <div className="bg-[#fde7e2] text-[#c8432c] rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2">
      <span className="shrink-0 text-sm">🔒</span>
      <span>{bannerText || defaultBanner}</span>
    </div>
  );
}
