import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import SignInForm from "@/app/_components/auth/sign-in/sign-in-form";
import medicalCapsule from "@/public/images/auth/medical-capsule.png";
import htvLogo from "@/public/svgs/htv-logo-black.svg";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function page() {
  return (
    <Suspense>
      <section className="flex h-screen">
        <div className="flex h-full flex-1 items-center justify-center bg-white">
          <div className="w-full max-w-[384px] space-y-20.5 p-4">
            <Image src={htvLogo} alt="htv logo" className="mx-auto" />

            <SignInForm />
          </div>
        </div>

        <div className="relative hidden h-full flex-1 lg:block">
          <Image src={medicalCapsule} alt="medical capsule" fill />
        </div>
      </section>
    </Suspense>
  );
}
