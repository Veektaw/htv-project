import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import Card from "@/app/_components/shared/dashboard/card";
import { getUsersApi } from "@/services/apis/users.api";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function page() {
  const res = await getUsersApi();

  console.log({ res });

  return (
    <main className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 pt-10 pb-6">
      <Header />

      <section className="flex-1 rounded-sm bg-white px-8 py-8.5">
        <div className="grid grid-cols-2 gap-6">
          <Card />
          <Card />
        </div>
      </section>
    </main>
  );
}
