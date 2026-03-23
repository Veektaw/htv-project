"use client";

import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import useForgotPassword from "./hooks/use-forgot-password";
import Link from "next/link";

type ForgotPasswordFormProps = {
  setEmail: (val: string) => void;
  setIsSuccessful: (val: boolean) => void;
};

export default function ForgotPasswordForm({
  setEmail,
  setIsSuccessful,
}: ForgotPasswordFormProps) {
  const { form, onSubmit, formState } = useForgotPassword({
    setEmail,
    setIsSuccessful,
  });
  const { isSubmitting } = formState;

  return (
    <section className="space-y-8 text-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-medium">Forgot Passoword</h1>
        <p className="text-OsloGrey text-base">
          Enter the email address you registered with and we will send you a
          link to create a new password.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder="Email address"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <div className="space-y-4">
          <Button
            className="w-full"
            disabled={!formState.isDirty || isSubmitting}
          >
            Submit {isSubmitting && <Spinner data-icon="inline-start" />}
          </Button>

          <p className="text-MountainMist text-center text-xs font-semibold">
            Remember password?{" "}
            <Link href="/sign-in" className="text-black">
              Log in now
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
