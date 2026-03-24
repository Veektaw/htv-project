"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/app/_components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import useCreateNewPassword from "./hooks/use-create-new-password";
import PasswordRequirementsTooltip from "../password-requirements";
import PasswordCreatedSuccessfully from "./password-created-successfully";

export default function CreateNewPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const { form, onSubmit, formState, redirectPath } = useCreateNewPassword({
    setIsSuccessful,
  });
  const { isSubmitting } = formState;

  if (isSuccessful) {
    return <PasswordCreatedSuccessfully redirectPath={redirectPath} />;
  }

  return (
    <div className="space-y-8 text-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-medium">Create new password</h1>
        <p className="text-OsloGrey text-base">
          Enter the password sent via mail when registered with
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-3">
          <Controller
            name="old_password"
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
            name="new_password"
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
                      placeholder="New Password*"
                    />

                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowPassword2((prev) => !prev)}
                        className="pr-2"
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

          <Controller
            name="confirm_new_password"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type={showPassword3 ? "text" : "password"}
                      placeholder="Confirm New Password*"
                    />

                    <InputGroupAddon
                      align="inline-end"
                      className="flex items-center gap-[12.5px] pr-4.5"
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword3((prev) => !prev)}
                      >
                        {showPassword3 ? (
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
        </div>

        <Button className="w-full" disabled={isSubmitting}>
          Create Passsword{" "}
          {isSubmitting && <Spinner data-icon="inline-start" />}
        </Button>
      </form>
    </div>
  );
}
