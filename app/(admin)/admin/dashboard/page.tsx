import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/dashboard/sub-header";
import Card from "@/app/_components/shared/dashboard/card";
import TotalUsersCard from "@/app/_components/admin/dashboard/total-users-card";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function page() {
  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6 shadow-[0px_9px_20px_0px_#101E730F]">
      <Header type="Admin">
        <SubHeader />
      </Header>

      <section className="flex-1 rounded-sm bg-white px-8 py-8.5">
        <div className="grid grid-cols-2 gap-6">
          <TotalUsersCard />
          <Card text="Outstanding Invoices" value={0} />
        </div>
      </section>
    </section>
  );
}
