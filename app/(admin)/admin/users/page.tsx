import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/users/sub-header";
import Loader from "@/app/_components/shared/loader";
import AllUsers from "@/app/_components/admin/users/all-users";

export const metadata: Metadata = {
  title: "Users",
};

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function page({ searchParams }: PageParams) {
  const { search, page, role } = await searchParams;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 pt-10 pb-6">
      <Header type="Admin">
        <SubHeader />
      </Header>

      <section className="flex-1 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <Suspense fallback={<Loader text="Getting users..." />}>
          <AllUsers search={search} page={page} role={role} />
        </Suspense>
      </section>
    </section>
  );
}
