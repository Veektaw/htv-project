import { Suspense } from "react";
import { Metadata } from "next";
import { getUser } from "@/services/auth";
import { Spinner } from "@/app/_components/ui/spinner";
import Header from "@/app/_components/shared/header/header";
import AccountInformation from "@/app/_components/admin/settings/account-information";
import AdvancedSettingsSkeleton from "@/app/_components/admin/settings/advanced-settings/advanced-settings-skeleton";
import AdvancedSettingsWrapper from "@/app/_components/admin/settings/advanced-settings/advanced-settings-wrapper";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export default async function page() {
  const user = await getUser();

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6">
      <Header type="Admin">
        <p className="py-2 text-base font-bold">Settings</p>
      </Header>

      <section className="flex-1 space-y-6 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <AccountInformation user={user!} />

        <Suspense
          fallback={
            <AdvancedSettingsSkeleton>
              <div className="flex h-53.75 items-center justify-center p-4">
                <Spinner />
              </div>
            </AdvancedSettingsSkeleton>
          }
        >
          <AdvancedSettingsWrapper />
        </Suspense>
      </section>
    </section>
  );
}
