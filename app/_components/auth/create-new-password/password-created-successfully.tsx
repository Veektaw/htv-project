import { Button } from "../../ui/button";
import Image from "next/image";
import Link from "next/link";
import checkIcon from "@/public/svgs/auth/fi_check.svg";

export default function PasswordCreatedSuccessfully({
  redirectPath,
}: {
  redirectPath: string | null;
}) {
  return (
    <section className="">
      <div className="mb-9 p-6.5">
        <div className="bg-WhiteLilac mx-auto flex size-[106.67px] items-center justify-center rounded-full">
          <Image src={checkIcon} alt="check icon" className="" />
        </div>
      </div>

      <div className="space-y-4.25">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create new password</h1>
          <p className="text-MistBlue text-sm">Password created successfully</p>
        </div>

        <Button className="w-full">
          <Link
            href={
              redirectPath ? `/sign-in?redirect=${redirectPath}` : "/sign-in"
            }
          >
            Return to Login
          </Link>
        </Button>
      </div>
    </section>
  );
}
