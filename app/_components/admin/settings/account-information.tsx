"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
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
import plus from "@/public/svgs/plus.svg";
import minus from "@/public/svgs/minus.svg";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import { nameTitles } from "@/lib/constants";
import { UserSessionData } from "@/types/auth";
import useUpdateUserProfile from "./hooks/use-update-user-profile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  brandPartners as brandPartnerOptions,
  platforms as platformOptions,
} from "@/lib/constants";
import Image from "next/image";
import { defaultPlatformValue } from "../users/user-details/hooks/use-update-user-details";

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
  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = useFieldArray({
    control: form.control,
    name: "platforms",
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
        <Accordion type="single" collapsible className="w-full pt-9">
          <AccordionItem value="item-2" className="space-y-3">
            <AccordionTrigger
              className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
              chevronDownClassName="size-6 text-GreyCloud"
            >
              Advanced Settings
            </AccordionTrigger>

            <AccordionContent className="border-GreyCloud rounded-xls space-y-9 border px-10 py-7">
              {/* Platform Configuration */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-black">
                  Invoice Configuration
                </h2>

                {platformFields.map((field, index) => (
                  <div key={field.id} className="flex justify-between gap-3">
                    <div className="border-GreyCloud rounded-xls grid flex-1 gap-2 border px-5.5 py-6 lg:grid-cols-2">
                      {/* Platform Selection */}
                      <Controller
                        control={form.control}
                        name={`platforms.${index}.platform`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Platform
                            </FieldLabel>

                            <Select
                              name={field.name}
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!canEdit}
                            >
                              <SelectTrigger
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="border-GreyChateau min-w-full"
                              >
                                <SelectValue placeholder="Select Platform here" />
                              </SelectTrigger>
                              <SelectContent position="item-aligned">
                                {platformOptions.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item}
                                    className="text-xs capitalize"
                                  >
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name={`platforms.${index}.bill_to_address`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Bill To Address
                            </FieldLabel>

                            <Select
                              name={field.name}
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!canEdit}
                            >
                              <SelectTrigger
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="border-GreyChateau min-w-full"
                              >
                                <SelectValue placeholder="Select Brand Partner here" />
                              </SelectTrigger>
                              <SelectContent position="item-aligned">
                                {brandPartnerOptions.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item}
                                    className="text-xs capitalize"
                                  >
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* External User ID */}
                      <Controller
                        name={`platforms.${index}.platform_account_recipient_email`}
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field
                              data-invalid={fieldState.invalid}
                              className="col-span-2"
                            >
                              <FieldLabel htmlFor={field.name}></FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter Recipient Email here"
                                className="border-GreyChateau"
                                disabled={!canEdit}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    </div>

                    {/* Add and remove buttons */}
                    <menu className="flex flex-col gap-y-1">
                      {index === 0 && (
                        <button
                          disabled={!canEdit}
                          type="button"
                          onClick={() => appendPlatform(defaultPlatformValue)}
                          className="disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Image src={plus} alt="plus icon" />
                        </button>
                      )}

                      {index > 0 && (
                        <button
                          disabled={!canEdit}
                          type="button"
                          onClick={() => removePlatform(index)}
                          className="disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Image src={minus} alt="minus icon" />
                        </button>
                      )}
                    </menu>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </form>
  );
}
