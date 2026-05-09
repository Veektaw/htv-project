import Image from "next/image";
import Link from "next/link";
import emailIcon from "@/public/svgs/red-email-icon.svg";

export default function ResetTokenSent({ email }: { email: string }) {
  return (
    <section className="space-y-6 text-center">
      <div className="bg-WhiteLilac mx-auto flex size-30 items-center justify-center overflow-hidden rounded-full">
        <Image src={emailIcon} alt="email icon" />
      </div>

      <div className="space-y-2">
        <h1 className="text-RangoonGreen text-xl font-medium md:text-2xl">
          Forgot Password
        </h1>
        <p className="text-OsloGrey text-sm md:text-base">
          We’ve sent a link to create a new password to{" "}
          <span className="text-black">{email}</span>. If it’s not in your
          inbox, check your spam/junk folder.
        </p>
      </div>

      <Link
        href="/sign-in"
        className="inline-block text-xs font-bold text-black md:text-sm"
      >
        Back to login
      </Link>

      <p className="rounded-xls bg-ResolutionBlue/10 mx-auto max-w-77 px-7 py-3 text-[0.625rem] text-black md:text-xs">
        If you did not initiate the request, kindly contact us at HTV
      </p>
    </section>
  );
}
