import { Metadata } from "next";
import { getUser } from "@/services/auth";
import Header from "@/app/_components/shared/header/header";
import AccountInformation from "@/app/_components/doctor/settings/account-information";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export default async function page() {
  const user = await getUser();

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6">
      <Header type="Doctor">
        <p className="py-2 text-base font-bold">Settings</p>
      </Header>

      <section className="flex-1 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <AccountInformation user={user!} />
      </section>
    </section>
  );
}
