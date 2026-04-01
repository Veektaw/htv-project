import { Suspense } from "react";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/users/sub-header";
import Loader from "@/app/_components/shared/loader";
import UserDetailsWrapper from "@/app/_components/admin/users/user-details/user-details-wrapper";

// export async function generateStaticParams() {
//   const posts = await fetch('https://.../posts').then((res) => res.json())

//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

type PageParams = {
  params: Promise<{ [key: string]: string | undefined }>;
};

export default async function page({ params }: PageParams) {
  const { id } = await params;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 pt-10 pb-6">
      <Header type="Admin">
        <SubHeader />
      </Header>

      <section className="flex-1 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <Suspense fallback={<PageLoader />}>
          <UserDetailsWrapper userId={id!} />
        </Suspense>
      </section>
    </section>
  );
}

function PageLoader() {
  return (
    <section className="flex h-full flex-col">
      <h2 className="text-[2rem] font-bold">User Profile</h2>

      <Loader text="Getting user details..." className="flex-1" />
    </section>
  );
}
