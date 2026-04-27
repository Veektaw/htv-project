"use client";

import { useEffect, useState } from "react";
import {
  brandPartners as brandPartnerOptions,
  nameTitles,
} from "@/lib/constants";
import { Platform } from "@/types/platforms";
import { getPlatformsAction } from "@/services/actions/platforms.actions";
import useUpdateAdvanceSettings, {
  defaultPlatformValues,
} from "./hooks/use-update-advance-settings";
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
import { UserSessionData } from "@/types/auth";
import useUpdateUserProfile from "./hooks/use-update-user-profile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import Image from "next/image";
import plus from "@/public/svgs/plus.svg";
import minus from "@/public/svgs/minus.svg";

export default function AccountInformation({
  user,
}: {
  user: UserSessionData;
}) {
  const [userPlatforms, setUserPlatforms] = useState<Platform[]>([]);

  const { form, onSubmit, formState, canEdit, setCanEdit } =
    useUpdateUserProfile({
      user,
    });
  const { isSubmitting } = formState;

  const {
    advancedForm,
    platformFields,
    canEditAdvanced,
    setCanEditAdvanced,
    onSubmitAdvanced,
    loadingPlatforms,
    setLoadingPlatforms,
    appendPlatform,
    removePlatform,
  } = useUpdateAdvanceSettings({
    platforms: userPlatforms,
  });

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoadingPlatforms(true);
      try {
        const result = await getPlatformsAction();
        console.log({ result });
        if (!result.error && result.platforms.length > 0) {
          setUserPlatforms(result.platforms);
          advancedForm.reset({
            platforms: result.platforms.map((p: Platform) => ({
              // platform: p.platform,
              brand_partner: p.brand_partner,
              address: p.address,
              id: p.id,
              // external_user_id: p.external_user_id,
              platform_account_recipient_email:
                p.platform_account_recipient_email ?? "",
            })),
          });
        }
      } catch (error) {
        console.error("Failed to fetch platforms:", error);
      } finally {
        setLoadingPlatforms(false);
      }
    };
    fetchPlatforms();
  }, [advancedForm, setLoadingPlatforms]);

  console.log({
    advancedFormValues: advancedForm.watch(),
    advancedFormErrors: advancedForm.formState.errors,
  });

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold lg:text-[2rem]">
            Account Information
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2" className="space-y-3">
            <AccordionTrigger
              className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
              chevronDownClassName="size-6 text-GreyCloud"
            >
              Basic Settings
            </AccordionTrigger>
            <AccordionContent className="border-GreyCloud rounded-xls space-y-9 border px-10 py-7">
              <div className="flex items-center justify-end">
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
              <div className="border-GreyChateau mt-6 rounded-[32px] border px-10 py-13.5">
                <FieldGroup className="grid grid-cols-2 gap-x-10.5 gap-y-6">
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
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
                    )}
                  />

                  <Controller
                    name="first_name"
                    disabled={!canEdit}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          First Name*
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Type in user's first name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="last_name"
                    disabled={!canEdit}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Last Name*</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Type in user's last name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    disabled
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email address*
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          type="email"
                          placeholder="Type in user's email address here"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    disabled={!canEdit}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Phone Number
                        </FieldLabel>
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
                    )}
                  />

                  <Controller
                    name="company_name"
                    disabled={!canEdit}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Company Name
                        </FieldLabel>
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
                    )}
                  />
                </FieldGroup>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>

      {/* ── Advanced Settings Form — completely separate ── */}
      <form onSubmit={advancedForm.handleSubmit(onSubmitAdvanced)}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2" className="space-y-3">
            <AccordionTrigger
              className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
              chevronDownClassName="size-6 text-GreyCloud"
            >
              Advanced Settings
            </AccordionTrigger>

            <AccordionContent className="border-GreyCloud rounded-xls space-y-9 border px-10 py-7">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-black">
                  Platform Configuration
                </h2>
                <Button
                  type={canEditAdvanced ? "submit" : "button"}
                  disabled={advancedForm.formState.isSubmitting}
                  onClick={(e) => {
                    if (!canEditAdvanced) {
                      e.preventDefault();
                      setCanEditAdvanced(true);
                    }
                  }}
                  variant="secondary"
                  className="inline-flex h-10 w-36"
                >
                  {canEditAdvanced ? "Save Changes" : "Update"}
                  {advancedForm.formState.isSubmitting && (
                    <Spinner data-icon="inline-start" />
                  )}
                </Button>
              </div>

              {loadingPlatforms ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner />
                </div>
              ) : platformFields.length === 0 ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-gray-400">
                    No platforms configured.
                  </p>

                  <Button
                    variant="secondary"
                    // disabled={!canEdit}
                    type="button"
                    onClick={() => appendPlatform(defaultPlatformValues)}
                    className="h-10 w-36 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Platform
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {platformFields.map((field, index) => (
                    <div key={field.id} className="flex justify-between gap-3">
                      <div className="border-GreyCloud rounded-xls grid flex-1 gap-4 border px-5.5 py-6 lg:grid-cols-2">
                        {/* Brand Partner */}
                        <Controller
                          control={advancedForm.control}
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
                                disabled={!canEditAdvanced}
                              >
                                <SelectTrigger
                                  id={field.name}
                                  aria-invalid={fieldState.invalid}
                                  className="border-GreyChateau min-w-full"
                                >
                                  <SelectValue placeholder="Select Brand Partner" />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                  {brandPartnerOptions.map((item, i) => {
                                    // Get all selected brand partners across the form
                                    const selectedPartners = advancedForm
                                      .watch("platforms")
                                      ?.map((p) => p.brand_partner)
                                      .filter(Boolean);

                                    const isAlreadySelected =
                                      selectedPartners?.includes(item) &&
                                      field.value !== item;

                                    return (
                                      <SelectItem
                                        key={i}
                                        value={item}
                                        disabled={isAlreadySelected}
                                        className="text-xs capitalize"
                                      >
                                        {item}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        {/* Bill To Email */}
                        <Controller
                          control={advancedForm.control}
                          name={`platforms.${index}.platform_account_recipient_email`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>
                                Bill To Email
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter bill to email"
                                className="border-GreyChateau"
                                disabled={!canEditAdvanced}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        {/* Bill To Address */}
                        <Controller
                          control={advancedForm.control}
                          name={`platforms.${index}.address`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>
                                Bill To Address
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter bill to address"
                                className="border-GreyChateau"
                                disabled={!canEditAdvanced}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      {/* Add and remove buttons */}
                      <menu className="flex flex-col gap-y-1">
                        {index === 0 && (
                          <button
                            disabled={!canEditAdvanced}
                            type="button"
                            onClick={() =>
                              appendPlatform(defaultPlatformValues)
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Image src={plus} alt="plus icon" />
                          </button>
                        )}

                        {index > 0 && (
                          <button
                            disabled={!canEditAdvanced}
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
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}
