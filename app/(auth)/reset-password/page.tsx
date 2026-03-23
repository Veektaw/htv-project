import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import ResetPassword from "@/app/_components/auth/reset-password/reset-password";
import htvLogo from "@/public/svgs/htv-logo-black.svg";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function page() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen items-center justify-center bg-[url(/images/auth/auth-bg.png)] bg-bottom-right bg-no-repeat p-4">
          <div className="w-full max-w-[384px] space-y-20.5 p-4">
            <Image src={htvLogo} alt="htv logo" className="mx-auto" />

            <div className="bg-CatskillWhite h-90 animate-pulse"></div>
          </div>
        </section>
      }
    >
      <section className="flex min-h-screen items-center justify-center bg-[url(/images/auth/auth-bg.png)] bg-bottom-right bg-no-repeat p-4">
        <div className="w-full max-w-[384px] space-y-20.5 p-4">
          <Image src={htvLogo} alt="htv logo" className="mx-auto" />

          <ResetPassword />
        </div>
      </section>
    </Suspense>
  );
}
