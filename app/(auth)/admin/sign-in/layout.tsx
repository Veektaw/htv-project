import { ReactNode } from "react";
import Image from "next/image";
import medicalCapsule from "@/public/images/auth/medical-capsule-2.png";
import htvLogo from "@/public/svgs/htv-logo-black.svg";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <section className="flex h-screen">
      <div className="flex h-full flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-[384px] space-y-20.5 p-4">
          <Image src={htvLogo} alt="htv logo" className="mx-auto" />

          {children}
        </div>
      </div>

      <div className="relative hidden h-full flex-1 lg:block">
        <Image src={medicalCapsule} alt="medical capsule" fill />
      </div>
    </section>
  );
}
