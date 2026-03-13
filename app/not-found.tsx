import Image from "next/image";
import Link from "next/link";
import htvLogo from "@/public/svgs/htv-logo-black.svg";
import notFoundIcon from "@/public/svgs/not-found.svg";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[url(/images/auth/auth-bg.png)] bg-bottom-right bg-no-repeat p-4">
      <div className="w-full max-w-101 space-y-20.5">
        <Image src={htvLogo} alt="htv logo" className="mx-auto" />

        <div className="space-y-6.5">
          <Image src={notFoundIcon} alt="not found" className="mx-auto" />

          <div className="space-y-2 p-4 text-center">
            <h1 className="text-[4.5rem] font-medium">Error 404</h1>
            <p className="text-OsloGrey text-base">Page not found</p>
          </div>

          <div className="p-3 text-center">
            <Link href="/sign-in" className="font-bold text-black">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
