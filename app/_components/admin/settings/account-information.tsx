"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import { nameTitles } from "@/lib/constants";
import { UserSessionData } from "@/types/auth";
import useUpdateUserProfile from "./hooks/use-update-user-profile";

export default function AccountInformation({
  user,
}: {
  user: UserSessionData;
}) {
  const [canEdit, setCanEdit] = useState(false);

  const { form, onSubmit, formState } = useUpdateUserProfile({
    user,
    setCanEdit,
  });
  const { isSubmitting } = formState;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold lg:text-[2rem]">
          Account Information
        </h2>

        <Button
          type={canEdit ? "submit" : "button"}
          disabled={isSubmitting}
          onClick={(e) => {
            if (!canEdit) {
              e.preventDefault();
              setCanEdit(true);
            }
          }}
          variant="secondary"
          className="inline-flex h-12 w-38.5"
        >
          {canEdit ? "Save Changes" : "Update"}
          {isSubmitting && <Spinner data-icon="inline-start" />}
        </Button>
      </div>

      <div className="border-GreyChateau rounded-[32px] border px-10 py-13.5">
        <FieldGroup className="grid grid-cols-2 gap-x-10.5 gap-y-6">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title*</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!canEdit}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="min-w-full"
                    >
                      <SelectValue placeholder="Add Title, Dr, Mr, Mrs, Miss" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {nameTitles.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="first_name"
            disabled={!canEdit}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>First Name*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Type in user’s first name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="last_name"
            disabled={!canEdit}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Last Name*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Type in user’s last name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="email"
            disabled
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email address*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder="Type in user’s email address here"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="phone"
            disabled={!canEdit}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Type in phone number with country code"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="company_name"
            disabled={!canEdit}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Company Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </div>
    </form>
  );
}
