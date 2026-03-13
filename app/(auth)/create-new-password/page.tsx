import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import CreateNewPasswordForm from "@/app/_components/auth/create-new-password/create-new-password-form";
import htvLogo from "@/public/svgs/htv-logo-black.svg";

export const metadata: Metadata = {
  title: "Create new password",
};

export default function page() {
  return (
    <Suspense>
      <section className="flex min-h-screen items-center justify-center bg-[url(/images/auth/auth-bg.png)] bg-bottom-right bg-no-repeat p-4">
        <div className="w-full max-w-[384px] space-y-20.5 p-4">
          <Image src={htvLogo} alt="htv logo" className="mx-auto" />

          <CreateNewPasswordForm />
        </div>
      </section>
    </Suspense>
  );
}
