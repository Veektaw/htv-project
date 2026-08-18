import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PharmacyDetail from "@/app/_components/admin/partners/pharmacy-detail/pharmacy-detail";

export const metadata: Metadata = {
  title: "Pharmacy Details | HTV Admin",
};

export default async function PharmacyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Admin" />
      <PharmacyDetail pharmacyId={id} />
    </div>
  );
}
