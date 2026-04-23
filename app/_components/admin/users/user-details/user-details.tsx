"use client";

import { useState } from "react";
import {
  brandPartners as brandPartnerOptions,
  languages,
  nameTitles,
  platforms as platformOptions,
} from "@/lib/constants";
import { User } from "@/types/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/app/_components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/app/_components/ui/input-group";
import { Input } from "@/app/_components/ui/input";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import useUpdateUserDetails, {
  commissionOptions,
  defaultCommissionValue,
  defaultPlatformValue,
} from "./hooks/use-update-user-details";
import Image from "next/image";
import ActivateUserModal from "@/app/_components/admin/users/modals/activate-user";
import plus from "@/public/svgs/plus.svg";
import minus from "@/public/svgs/minus.svg";

export default function UserDetails({ user }: { user: User }) {
  const [canEdit, setCanEdit] = useState(false);

  const {
    form,
    onSubmit,
    formState,
    platformFieldsArrayValues,
    commissionFieldsArrayValues,
  } = useUpdateUserDetails({
    user,
    setCanEdit,
  });
  const { isSubmitting } = formState;

  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = platformFieldsArrayValues;

  const {
    fields: commissionFields,
    append: appendCommission,
    remove: removeCommission,
  } = commissionFieldsArrayValues;

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className="flex h-full flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold lg:text-[2rem]">User Profile</h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type={canEdit ? "submit" : "button"}
              disabled={isSubmitting}
              onClick={(e) => {
                if (!canEdit) {
                  e.preventDefault();
                  setCanEdit(true);
                }
              }}
              variant="outline"
              className="inline-flex h-12 w-44 items-center justify-center rounded-[24px] border border-black px-6 text-sm font-semibold text-black"
            >
              {canEdit ? "Save Changes" : "Edit Profile"}
              {isSubmitting && <Spinner data-icon="inline-start" />}
            </Button>

            <ActivateUserModal user={user}>
              <Button variant="secondary" className="h-12 px-13">
                {user.is_deactivated ? "Reactivate" : "Deactivate"} User
              </Button>
            </ActivateUserModal>
          </div>
        </div>

        <div className="pb-10">
          <Accordion
            type="multiple"
            defaultValue={["item-1"]}
            className="space-y-5 overflow-hidden"
          >
            <AccordionItem value="item-1" className="space-y-3 border-none">
              <AccordionTrigger
                className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
                chevronDownClassName="size-6 text-GreyCloud"
              >
                Basic Settings
              </AccordionTrigger>

              <AccordionContent className="border-GreyCloud rounded-xls space-y-3 border px-10 py-7">
                <div className="flex items-center gap-3">
                  <div className="flex w-1/2 items-center gap-3">
                    <Controller
                      name="title"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field
                            data-invalid={fieldState.invalid}
                            className="w-21.75"
                          >
                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>

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
                                <SelectValue placeholder="Title" />
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
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              First Name
                            </FieldLabel>
                            <Input
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="First name"
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

                  <Controller
                    name="last_name"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="w-1/2"
                        >
                          <FieldLabel htmlFor={field.name}>
                            Last Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Last name"
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

                <div className="flex items-center gap-3">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Email address
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            type="email"
                            placeholder="Email address"
                            className="border-GreyChateau"
                            disabled={true}
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
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Phone Number
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Phone"
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

                <div className="flex items-center gap-3">
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Role</FieldLabel>

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
                              <SelectValue placeholder="Click to select role" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
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
                    name="language_pref"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Language Preference
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
                              <SelectValue placeholder="Click to select language preference" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              {languages.map((item, index) => (
                                <SelectItem key={index} value={item.type}>
                                  {item.name}
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
                </div>

                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Residential Address
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Address"
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
              </AccordionContent>
            </AccordionItem>

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
                    Platform Configuration
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

                        {/* Brand Partner Selection */}
                        <Controller
                          control={form.control}
                          name={`platforms.${index}.brand_partner`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>
                                Brand Partner
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
                          name={`platforms.${index}.external_user_id`}
                          control={form.control}
                          render={({ field, fieldState }) => {
                            return (
                              <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-2"
                              >
                                <FieldLabel htmlFor={field.name}>
                                  User ID
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={field.name}
                                  aria-invalid={fieldState.invalid}
                                  placeholder="Enter User ID here"
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

                {/* Commission Configuration */}
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-black">
                    Commission Configuration
                  </h2>

                  {commissionFields.map((field, index) => (
                    <div key={field.id} className="flex justify-between gap-3">
                      <div className="border-GreyCloud rounded-xls grid flex-1 gap-x-2 gap-y-3 border px-5.5 py-6 lg:grid-cols-2">
                        {/* Brand Partner selection */}
                        <Controller
                          control={form.control}
                          name={`commissions.${index}.platform`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>
                                Brand Partner
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

                        {/* Amount Per Prescription */}
                        <Controller
                          control={form.control}
                          name={`commissions.${index}.amount_per_prescription`}
                          render={({ field, fieldState }) => {
                            return (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Amount Per Prescription
                                </FieldLabel>

                                <InputGroup className="border-GreyChateau py-2.5 text-black">
                                  <InputGroupAddon>
                                    <InputGroupText className="font-normal text-black">
                                      EUR:
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <InputGroupInput
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      // Allow only numbers and at most two decimal places
                                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                                        field.onChange(value);
                                      }
                                    }}
                                    inputMode="numeric"
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="00"
                                    className="border-GreyChateau border placeholder:text-black"
                                    disabled={!canEdit}
                                  />
                                </InputGroup>

                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            );
                          }}
                        />

                        {/* Commission Options */}
                        <FieldGroup
                          data-slot="checkbox-group"
                          className="col-span-2 grid gap-x-6 lg:grid-cols-2"
                        >
                          {commissionOptions.map(
                            (commissionOption, commissionOptionIndex) => (
                              <Controller
                                key={commissionOptionIndex}
                                name={`commissions.${index}.${commissionOption.id}`}
                                control={form.control}
                                render={({ field, fieldState }) => {
                                  return (
                                    <FieldSet className="gap-2">
                                      <Field
                                        key={commissionOptionIndex}
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                        className="gap-2 px-3 py-1"
                                      >
                                        <Checkbox
                                          disabled={!canEdit}
                                          id={`form-rhf-checkbox-${index}-${commissionOption.id}`}
                                          name={field.name}
                                          aria-invalid={fieldState.invalid}
                                          checked={!!field.value}
                                          onCheckedChange={(checked) => {
                                            const path =
                                              `commissions.${index}` as const;

                                            if (
                                              commissionOption.id ===
                                              "all_prescriptions"
                                            ) {
                                              form.setValue(
                                                `${path}.all_prescriptions`,
                                                !!checked,
                                              );
                                              form.setValue(
                                                `${path}.signed_prescriptions`,
                                                !!checked,
                                              );
                                              form.setValue(
                                                `${path}.cancelled_prescriptions`,
                                                !!checked,
                                              );
                                            } else {
                                              field.onChange(checked);

                                              // If either sub-option is unchecked, uncheck all_prescriptions
                                              if (!checked) {
                                                form.setValue(
                                                  `${path}.all_prescriptions`,
                                                  false,
                                                );
                                              }

                                              // If both sub-options are now checked, check all_prescriptions
                                              const signed = form.getValues(
                                                `${path}.signed_prescriptions`,
                                              );
                                              const cancelled = form.getValues(
                                                `${path}.cancelled_prescriptions`,
                                              );

                                              if (signed && cancelled) {
                                                form.setValue(
                                                  `${path}.all_prescriptions`,
                                                  true,
                                                );
                                              }
                                            }
                                          }}
                                          className="border-OsloGrey size-6"
                                        />
                                        <FieldLabel
                                          htmlFor={`form-rhf-checkbox-${index}-${commissionOption.id}`}
                                          className="font-medium text-black"
                                        >
                                          {commissionOption.label}
                                        </FieldLabel>
                                      </Field>

                                      {fieldState.invalid && (
                                        <FieldError
                                          errors={[fieldState.error]}
                                        />
                                      )}
                                    </FieldSet>
                                  );
                                }}
                              />
                            ),
                          )}
                        </FieldGroup>
                      </div>

                      {/* Add and remove buttons */}
                      <menu className="flex flex-col gap-y-1">
                        {index === 0 && (
                          <button
                            disabled={!canEdit}
                            type="button"
                            onClick={() =>
                              appendCommission(defaultCommissionValue)
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Image src={plus} alt="plus icon" />
                          </button>
                        )}

                        {index > 0 && (
                          <button
                            disabled={!canEdit}
                            type="button"
                            onClick={() => removeCommission(index)}
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
      </FieldGroup>
    </form>
  );
}
