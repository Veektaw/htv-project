"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import { Field, FieldError } from "@/app/_components/ui/field";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import useResetPassword from "./hooks/use-reset-password";
import Link from "next/link";
import PasswordRequirementsTooltip from "../password-requirements";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { form, onSubmit, formState } = useResetPassword();
  const { isSubmitting } = formState;

  return (
    <section className="space-y-8 text-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-medium">Forgot Password</h1>
        <p className="text-OsloGrey text-base">
          Enter the your new password and confirm your new password to continue
          to log in.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password*"
                  />

                  <InputGroupAddon
                    align="inline-end"
                    className="flex items-center gap-[12.5px] pr-4.5"
                  >
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye className="text-OsloGrey size-4.5" />
                      ) : (
                        <EyeOff className="text-OsloGrey size-4.5" />
                      )}
                    </button>
                    <PasswordRequirementsTooltip />
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <Controller
          name="confirm_password"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirm Password*"
                  />

                  <InputGroupAddon align="inline-end" className="pr-4.5">
                    <button
                      type="button"
                      onClick={() => setShowPassword2((prev) => !prev)}
                    >
                      {showPassword2 ? (
                        <Eye className="text-OsloGrey size-4.5" />
                      ) : (
                        <EyeOff className="text-OsloGrey size-4.5" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <div className="space-y-4">
          <Button className="w-full" disabled={isSubmitting}>
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
