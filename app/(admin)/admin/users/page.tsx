import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/users/sub-header";
import AllUsers, { Loader } from "@/app/_components/admin/users/all-users";

export const metadata: Metadata = {
  title: "Users",
};

export default function page() {
  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 pt-10 pb-6 shadow-[0px_9px_20px_0px_#101E730F]">
      <Header>
        <SubHeader />
      </Header>

      <section className="flex-1 rounded-sm bg-white px-7 py-5.5">
        <Suspense fallback={<Loader />}>
          <AllUsers />
        </Suspense>
      </section>
    </section>
  );
}
