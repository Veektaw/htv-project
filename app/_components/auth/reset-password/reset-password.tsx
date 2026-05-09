"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "./reset-password-form";
import ForgotPasswordForm from "./forgot-password-form";
import ResetTokenSent from "./reset-token-sent";

export default function ResetPassword() {
  const token = useSearchParams().get("token");

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  return token ? (
    <ResetPasswordForm />
  ) : !isSuccessful ? (
    <ForgotPasswordForm setEmail={setEmail} setIsSuccessful={setIsSuccessful} />
  ) : (
    <ResetTokenSent email={email} />
  );
}
