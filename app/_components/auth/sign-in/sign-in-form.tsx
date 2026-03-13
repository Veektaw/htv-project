"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import useLogin from "./hooks/use-login";
import PasswordRequirementsTooltip from "../password-requirements";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { form, onSubmit, formState } = useLogin();
  const { isSubmitting } = formState;

  return (
    <div className="space-y-8 text-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-[2.375rem] font-bold">Welcome</h1>
        <p className="text-OsloGrey text-base">Log In to your account</p>
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

        <div className="space-y-3">
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
                      placeholder="Password*"
                    />

                    <InputGroupAddon
                      align="inline-end"
                      className="flex items-center gap-[12.5px]"
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

          <p className="font-semibold text-black">Forgot password?</p>
        </div>

        <Button className="w-full" disabled={isSubmitting}>
          Log in {isSubmitting && <Spinner data-icon="inline-start" />}
        </Button>
      </form>
    </div>
  );
}
