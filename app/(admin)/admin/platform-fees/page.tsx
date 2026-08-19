import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PlatformFees from "@/app/_components/admin/partners/fees/platform-fees";

export const metadata: Metadata = {
  title: "Platform Fees | HTV Admin",
};

export default function PlatformFeesPage() {
  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Admin" />
      <PlatformFees />
    </div>
  );
}
