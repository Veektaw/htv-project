"use client";

import {
  brandPartners as brandPartnerOptions,
  platforms as platformOptions,
} from "@/lib/constants";
import { ResponseType } from "@/types/api";
import { AdminCreatePlatformResponse } from "@/types/platforms";
import useUpdateAdvanceSettings, {
  defaultPlatformValues,
} from "../hooks/use-update-advance-settings";
import { Controller, useFormState } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Input } from "@/app/_components/ui/input";
import { Spinner } from "@/app/_components/ui/spinner";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";
import AdvancedSettingsSkeleton from "./advanced-settings-skeleton";

type AdvancedSettingsProps = {
  allPlatformsResponse: ResponseType<AdminCreatePlatformResponse[]>;
};

export default function AdvancedSettings({
  allPlatformsResponse,
}: AdvancedSettingsProps) {
  const {
    advancedForm,
    platformFields,
    pendingPlatformAction,
    appendPlatform,
    createPlatform,
    updatePlatform,
    deletePlatform,
  } = useUpdateAdvanceSettings({
    platforms: allPlatformsResponse.body as AdminCreatePlatformResponse[],
  });

  const { errors } = useFormState({
    control: advancedForm.control,
    name: "platforms",
  });
  const platformErrors = errors.platforms;

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <AdvancedSettingsSkeleton
        addPlatformButton={
          platformFields.length > 0 && (
            <Button
              type="button"
              onClick={() => appendPlatform(defaultPlatformValues)}
              variant="secondary"
              className="inline-flex h-10 w-36"
            >
              Add Platform
            </Button>
          )
        }
      >
        {platformFields.length === 0 ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">No platforms configured.</p>

            <Button
              variant="secondary"
              type="button"
              onClick={() => appendPlatform(defaultPlatformValues)}
              className="h-10 w-36"
            >
              Add Platform
            </Button>
          </div>
        ) : platformFields.length > 0 ? (
          <div className="space-y-4">
            {platformFields.map((field, index) => {
              const platformId = advancedForm.watch(`platforms.${index}.id`);
              const platformError = platformErrors?.[index]?.platform;
              const brandPartnerError = platformErrors?.[index]?.brand_partner;
              const billToEmailError =
                platformErrors?.[index]?.platform_account_recipient_email;
              const addressError = platformErrors?.[index]?.address;
              const selectedPlatform = advancedForm.watch(
                `platforms.${index}.platform`,
              );
              const selectedBrandPartner = advancedForm.watch(
                `platforms.${index}.brand_partner`,
              );
              const selectedPlatforms = advancedForm.watch("platforms");

              const isCreating = pendingPlatformAction === `create-${index}`;
              const isUpdating =
                pendingPlatformAction === `update-${platformId}`;
              const isDeleting =
                pendingPlatformAction === `delete-${platformId}`;
              const isActionPending = Boolean(pendingPlatformAction);

              return (
                <div key={field.fieldId} className="flex justify-between gap-3">
                  <div className="border-GreyCloud rounded-xls grid flex-1 gap-4 border px-5.5 py-6 lg:grid-cols-2">
                    {/* Platform Selection */}
                    <Controller
                      control={advancedForm.control}
                      name={`platforms.${index}.platform`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={
                            fieldState.invalid || Boolean(platformError)
                          }
                        >
                          <FieldLabel htmlFor={field.name}>Platform</FieldLabel>

                          <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              className="border-GreyChateau min-w-full"
                            >
                              <SelectValue placeholder="Select Platform here" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              {platformOptions.map((item, platformIndex) => {
                                const isDuplicatePair =
                                  Boolean(selectedBrandPartner) &&
                                  selectedPlatforms?.some(
                                    (platform, selectedIndex) =>
                                      selectedIndex !== index &&
                                      platform.platform === item &&
                                      platform.brand_partner ===
                                        selectedBrandPartner,
                                  );

                                return (
                                  <SelectItem
                                    key={platformIndex}
                                    value={item}
                                    disabled={isDuplicatePair}
                                    className="text-xs capitalize"
                                  >
                                    {item}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {(fieldState.invalid || platformError) && (
                            <FieldError
                              errors={[fieldState.error || platformError]}
                            />
                          )}
                        </Field>
                      )}
                    />

                    {/* Brand Partner */}
                    <Controller
                      control={advancedForm.control}
                      name={`platforms.${index}.brand_partner`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={
                            fieldState.invalid || Boolean(brandPartnerError)
                          }
                        >
                          <FieldLabel htmlFor={field.name}>
                            Brand Partner
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
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
                                const isDuplicatePair =
                                  Boolean(selectedPlatform) &&
                                  selectedPlatforms?.some(
                                    (platform, selectedIndex) =>
                                      selectedIndex !== index &&
                                      platform.platform === selectedPlatform &&
                                      platform.brand_partner === item,
                                  );

                                return (
                                  <SelectItem
                                    key={i}
                                    value={item}
                                    disabled={isDuplicatePair}
                                    className="text-xs capitalize"
                                  >
                                    {item}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {(fieldState.invalid || brandPartnerError) && (
                            <FieldError
                              errors={[fieldState.error || brandPartnerError]}
                            />
                          )}
                        </Field>
                      )}
                    />

                    {/* Bill To Email */}
                    <Controller
                      control={advancedForm.control}
                      name={`platforms.${index}.platform_account_recipient_email`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={
                            fieldState.invalid || Boolean(billToEmailError)
                          }
                        >
                          <FieldLabel htmlFor={field.name}>
                            Bill To Email
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter bill to email"
                            className="border-GreyChateau"
                          />
                          {(fieldState.invalid || billToEmailError) && (
                            <FieldError
                              errors={[fieldState.error || billToEmailError]}
                            />
                          )}
                        </Field>
                      )}
                    />

                    {/* Bill To Address */}
                    <Controller
                      control={advancedForm.control}
                      name={`platforms.${index}.address`}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={
                            fieldState.invalid || Boolean(addressError)
                          }
                        >
                          <FieldLabel htmlFor={field.name}>
                            Bill To Address
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter bill to address"
                            className="border-GreyChateau"
                          />
                          {(fieldState.invalid || addressError) && (
                            <FieldError
                              errors={[fieldState.error || addressError]}
                            />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Open platform actions"
                        disabled={isActionPending}
                      >
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!platformId ? (
                        <DropdownMenuItem
                          disabled={isActionPending}
                          onSelect={(event) => {
                            event.preventDefault();
                            createPlatform(index);
                          }}
                        >
                          {isCreating ? (
                            <Spinner />
                          ) : (
                            <Plus className="size-4" />
                          )}
                          Create
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          disabled={isActionPending}
                          onSelect={(event) => {
                            event.preventDefault();
                            updatePlatform(index);
                          }}
                        >
                          {isUpdating ? (
                            <Spinner />
                          ) : (
                            <Pencil className="size-4" />
                          )}
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={isActionPending}
                        onSelect={(event) => {
                          event.preventDefault();
                          deletePlatform(index);
                        }}
                      >
                        {isDeleting ? (
                          <Spinner />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        ) : null}
      </AdvancedSettingsSkeleton>
    </form>
  );
}
