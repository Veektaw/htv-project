"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Reconciliation } from "@/types/reconciliations";
import { UserSessionData } from "@/types/auth";
import { brandPartners } from "@/lib/constants";
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
import { DialogClose } from "@/app/_components/ui/dialog";
import Image from "next/image";
import calendarIcon from "@/public/svgs/calendar.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/app/_components/ui/table";
import { Calendar } from "@/app/_components/ui/calendar";
import { showToast } from "@/lib/toast";
import { createManualInvoiceAction } from "@/services/actions/invoices.actions";
import useManualInvoice from "./hooks/use-manual-invoice";
import { getDoctorPrescriptionsAction } from "@/services/actions/prescriptions.actions";
import { getPlatformsActionTwo } from "@/services/actions/platforms.actions";
import { Prescription } from "@/types/prescriptions";

type InvoiceRow = {
  id: number;
  platform: string;
  totalPrescriptions: string;
  amount: string;
  periodFrom?: Date;
  periodTo?: Date;
};

const initialRow: InvoiceRow = {
  id: 1,
  platform: "",
  totalPrescriptions: "",
  amount: "",
  periodFrom: undefined,
  periodTo: undefined,
};

const getPeriodDates = (periodMonth?: string) => {
  if (!periodMonth) return { periodFrom: undefined, periodTo: undefined };
  const [year, month] = periodMonth.split("-").map(Number);
  if (!year || !month) return { periodFrom: undefined, periodTo: undefined };

  const periodFrom = new Date(year, month - 1, 1);
  const periodTo = new Date(year, month, 0);

  return { periodFrom, periodTo };
};

const formatToDateTimeLocal = (dateTime?: string) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const getInitialInvoiceRow = (reconciliation?: Reconciliation) => ({
  id: 1,
  platform: reconciliation?.platform ?? "",
  totalPrescriptions:
    reconciliation?.prescription_count !== undefined
      ? String(reconciliation.prescription_count)
      : "",
  amount:
    reconciliation?.gross_amount !== undefined
      ? String(reconciliation.gross_amount)
      : "",
  ...getPeriodDates(reconciliation?.period_month),
});

const getUserName = (
  reconciliation?: Reconciliation,
  user?: UserSessionData,
) => {
  if (user) {
    return (
      user.full_name ||
      [user.first_name, user.last_name].filter(Boolean).join(" ")
    );
  }
  if (!reconciliation?.user) return "";
  return (
    reconciliation.user.full_name ||
    [reconciliation.user.first_name, reconciliation.user.last_name]
      .filter(Boolean)
      .join(" ")
  );
};

export default function ManualInvoiceForm({
  reconciliation,
  user,
  onSuccess,
}: {
  reconciliation?: Reconciliation;
  user?: UserSessionData;
  onSuccess?: () => void;
}) {
  const defaultValues = {
    name: getUserName(reconciliation, user),
    address: user?.address ?? reconciliation?.user?.address ?? "",
    invoiceId: "",
    dateTime: formatToDateTimeLocal(reconciliation?.created_at),
    platform: reconciliation?.platform ?? "",
    amount: reconciliation?.gross_amount ?? 0,
    adyenPaid:
      reconciliation?.adyen_paid !== undefined
        ? String(reconciliation.adyen_paid)
        : "",
    period_month: reconciliation?.period_month ?? "",
  };

  const { form, formState, reset } = useManualInvoice({
    defaultValues,
  });

  console.log({ errors: form.formState.errors });

  const { handleSubmit, watch, setValue } = form;
  const [rows, setRows] = useState<InvoiceRow[]>(() => [
    getInitialInvoiceRow(reconciliation),
  ]);

  useEffect(() => {
    if (!reconciliation?.platform || !reconciliation?.period_month) return;

    const { periodFrom, periodTo } = getPeriodDates(
      reconciliation.period_month,
    );
    if (!periodFrom || !periodTo) return;

    getDoctorPrescriptionsAction({
      platform: reconciliation.platform,
      start_date: periodFrom.toISOString().split("T")[0],
      end_date: periodTo.toISOString().split("T")[0],
    }).then((res) => {
      const prescriptions = (
        res?.data as { body?: { prescriptions?: Prescription[] } }
      )?.body?.prescriptions;
      const total = prescriptions?.reduce(
        (sum: number, p: Prescription) => sum + p.prescription_count,
        0,
      );
      console.log("3. computed total", total);
      if (total !== undefined) {
        setRows((current) =>
          current.map((row) =>
            row.id === 1 ? { ...row, totalPrescriptions: String(total) } : row,
          ),
        );
      }
    });
  }, [reconciliation?.platform, reconciliation?.period_month]);

  useEffect(() => {
    if (!reconciliation?.platform || !reconciliation?.doctor_id) return;

    getPlatformsActionTwo().then((res) => {
      const platforms = (
        res?.data as {
          body?: {
            platforms?: Array<{ address: string; brand_partner: string }>;
          };
        }
      )?.body?.platforms;
      if (!platforms) return;

      const match = platforms.find(
        (p) => p.brand_partner === reconciliation.platform,
      );

      if (match?.address) {
        setValue("invoiceId", match.address);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reconciliation?.platform, reconciliation?.doctor_id]);

  const updateRow = (
    id: number,
    field:
      | "platform"
      | "totalPrescriptions"
      | "amount"
      | "periodFrom"
      | "periodTo",
    value: string | Date | undefined,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    );

    if (id === 1) {
      if (field === "platform") setValue("platform", value as string);
      if (field === "amount") setValue("amount", Number(value));

      if (field === "periodFrom" || field === "periodTo") {
        const row = rows.find((r) => r.id === id);
        const updatedRow = { ...row, [field]: value } as InvoiceRow;
        setValue("period_month", getPeriodMonth(updatedRow));
      }
    }
  };

  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value);

  const getPeriodMonth = (row: InvoiceRow) => {
    const date = row.periodFrom ?? row.periodTo;
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const sumTotal = rows.reduce((total, row) => {
    const amount = Number(row.amount.replace(/,/g, ""));
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const adyenPaid = Number(
    (watch("adyenPaid") ?? "").toString().replace(/,/g, ""),
  );
  const grossTotal = sumTotal - (Number.isFinite(adyenPaid) ? adyenPaid : 0);

  const handleFormSubmit = async () => {
    const row = rows[0];
    const period_month = getPeriodMonth(row);

    if (!period_month) {
      showToast("Please select a period month.", "error");
      return;
    }

    if (!row.platform) {
      showToast("Please enter a platform.", "error");
      return;
    }

    const formValues = form.getValues();

    const payload = {
      period_month,
      platform: row.platform,
      amount: sumTotal,
      full_name: formValues.name,
      address: formValues.address,
      bill_from_address: formValues.invoiceId,
    };

    try {
      const res = await createManualInvoiceAction(payload);

      if (!res.error) {
        if (onSuccess) {
          onSuccess();
        }

        reset();
        setRows([initialRow]);
        showToast(res.message);
      } else {
        showToast(res.message, "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FieldGroup className="grid grid-cols-2 gap-y-4 sm:grid-cols-2 sm:gap-x-10.5">
        <Controller
          name="name"
          disabled={!!reconciliation}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={form.control}
          disabled={!!reconciliation}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Address</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="invoiceId"
          control={form.control}
          disabled={!!reconciliation}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Bill to address</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="dateTime"
          control={form.control}
          disabled={!!reconciliation}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Date/Time</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="datetime-local"
                placeholder="YYYY/MM/DD HH:mm"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="rounded-base border-border bg-background border p-4">
        <p className="text-sm font-semibold text-black">Invoice line items</p>

        <Table className="mt-4 min-w-full">
          <TableHeader className="bg-SoftPeach">
            <TableRow>
              <TableHead className="px-8 py-4 text-xs tracking-[0.16em] text-black uppercase">
                S/N
              </TableHead>
              <TableHead className="px-8 py-4 text-xs tracking-[0.16em] text-black uppercase">
                Period
              </TableHead>
              <TableHead className="px-8 py-4 text-xs tracking-[0.16em] text-black uppercase">
                Platform
              </TableHead>
              <TableHead className="px-8 py-4 text-xs tracking-[0.16em] text-black uppercase">
                Total prescriptions
              </TableHead>
              <TableHead className="px-8 py-4 text-xs tracking-[0.16em] text-black uppercase">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground px-3 py-3 text-sm">
                  {index + 1}
                </TableCell>

                <TableCell className="px-3 py-3 align-top">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium text-black">From</p>
                      {reconciliation ? (
                        <Button
                          variant="outline"
                          className="h-9 w-full justify-between rounded-[24px] border-black px-3 py-2 text-left text-xs disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          disabled
                        >
                          <span className="flex items-center gap-2">
                            <Image src={calendarIcon} alt="calendar icon" />
                            <span className="text-muted-foreground">
                              {row.periodFrom
                                ? formatDate(row.periodFrom)
                                : "Start date"}
                            </span>
                          </span>
                          <span className="text-muted-foreground">▾</span>
                        </Button>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-9 w-full justify-between rounded-[24px] border-black px-3 py-2 text-left text-xs"
                              type="button"
                            >
                              <span className="flex items-center gap-2">
                                <Image src={calendarIcon} alt="calendar icon" />
                                <span className="text-muted-foreground">
                                  {row.periodFrom
                                    ? formatDate(row.periodFrom)
                                    : "Start date"}
                                </span>
                              </span>
                              <span className="text-muted-foreground">▾</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={row.periodFrom}
                              onSelect={(date) =>
                                updateRow(row.id, "periodFrom", date)
                              }
                              defaultMonth={row.periodTo ?? undefined}
                              fromMonth={
                                row.periodTo
                                  ? new Date(
                                      row.periodTo.getFullYear(),
                                      row.periodTo.getMonth(),
                                    )
                                  : undefined
                              }
                              toMonth={
                                row.periodTo
                                  ? new Date(
                                      row.periodTo.getFullYear(),
                                      row.periodTo.getMonth(),
                                    )
                                  : undefined
                              }
                              className="w-full"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium text-black">To</p>
                      {reconciliation ? (
                        <Button
                          variant="outline"
                          className="h-9 w-full justify-between rounded-[24px] border-black px-3 py-2 text-left text-xs disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          disabled
                        >
                          <span className="flex items-center gap-2">
                            <Image src={calendarIcon} alt="calendar icon" />
                            <span className="text-muted-foreground">
                              {row.periodTo
                                ? formatDate(row.periodTo)
                                : "End date"}
                            </span>
                          </span>
                          <span className="text-muted-foreground">▾</span>
                        </Button>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-9 w-full justify-between rounded-[24px] border-black px-3 py-2 text-left text-xs"
                              type="button"
                            >
                              <span className="flex items-center gap-2">
                                <Image src={calendarIcon} alt="calendar icon" />
                                <span className="text-muted-foreground">
                                  {row.periodTo
                                    ? formatDate(row.periodTo)
                                    : "End date"}
                                </span>
                              </span>
                              <span className="text-muted-foreground">▾</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={row.periodTo}
                              onSelect={(date) =>
                                updateRow(row.id, "periodTo", date)
                              }
                              defaultMonth={row.periodTo ?? undefined}
                              fromMonth={
                                row.periodTo
                                  ? new Date(
                                      row.periodTo.getFullYear(),
                                      row.periodTo.getMonth(),
                                    )
                                  : undefined
                              }
                              toMonth={
                                row.periodTo
                                  ? new Date(
                                      row.periodTo.getFullYear(),
                                      row.periodTo.getMonth(),
                                    )
                                  : undefined
                              }
                              className="w-full"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Select
                    value={row.platform}
                    onValueChange={(value) =>
                      updateRow(row.id, "platform", value)
                    }
                    disabled={!!reconciliation}
                  >
                    <SelectTrigger className="h-9 w-full text-xs text-black">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandPartners.map((partner) => (
                        <SelectItem
                          key={partner}
                          value={partner}
                          className="text-xs capitalize"
                        >
                          {partner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="px-3 py-3">
                  <Input
                    value={row.totalPrescriptions}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        "totalPrescriptions",
                        event.target.value,
                      )
                    }
                    placeholder="Total prescriptions"
                    disabled={!!reconciliation}
                    className="h-9 text-xs text-black"
                  />
                </TableCell>

                <TableCell className="px-3 py-3">
                  <Input
                    value={row.amount}
                    onChange={(event) =>
                      updateRow(row.id, "amount", event.target.value)
                    }
                    placeholder="Amount"
                    disabled={!!reconciliation}
                    className="h-9 text-xs text-black"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex w-full max-w-107.5 flex-col gap-2.5 rounded-lg border border-[#A6A8B1] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sum total</span>
          <span className="font-semibold text-black">
            {formatCurrency(sumTotal)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Adyen paid</span>
          <Controller
            name="adyenPaid"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="EUR"
                disabled={!!reconciliation}
                className="h-9 w-32 text-right! text-xs placeholder:text-right!"
              />
            )}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Gross total</span>
          <span className="text-lg font-semibold text-black">
            {formatCurrency(grossTotal)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-inter rounded-[44px] border border-[#BEC0CA] px-13 py-3"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="font-inter rounded-[44px] bg-black p-3 px-13"
          variant="secondary"
        >
          Submit {formState.isSubmitting && <Spinner />}
        </Button>
      </div>
    </form>
  );
}
