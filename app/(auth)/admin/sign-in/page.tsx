import { Suspense } from "react";
import SignInForm from "@/app/_components/auth/sign-in/sign-in-form";

export default function page() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
