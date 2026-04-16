"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";

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
import useManualInvoice from "./hooks/use-manual-invoice";

type InvoiceRow = {
  id: number;
  platform: string;
  totalPrescriptions: string;
  amount: string;
  periodFrom?: Date;
  periodTo?: Date;
};

export default function ManualInvoiceForm() {
  const { form, onSubmit, formState } = useManualInvoice();
  const [rows, setRows] = useState<InvoiceRow[]>([
    {
      id: 1,
      platform: "",
      totalPrescriptions: "",
      amount: "",
      periodFrom: undefined,
      periodTo: undefined,
    },
  ]);

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
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(value);

  const sumTotal = rows.reduce((total, row) => {
    const amount = Number(row.amount.replace(/,/g, ""));
    const prescriptions = Number(row.totalPrescriptions.replace(/,/g, ""));

    const rowTotal =
      Number.isFinite(prescriptions) && Number.isFinite(amount)
        ? prescriptions * amount
        : 0;

    return total + rowTotal;
  }, 0);

  const grossTotal = sumTotal;

  return (
    <form onSubmit={onSubmit} className="space-y-9.5">
      <FieldGroup className="grid grid-cols-2 gap-y-6 sm:grid-cols-2 sm:gap-x-10.5">
        <Controller
          name="userId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>User ID</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter the user identification number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="invoiceId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Invoice Id</FieldLabel>
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
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor={field.name}>Date/Time</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="datetime-local"
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
                            defaultMonth={row.periodFrom ?? undefined}
                            endMonth={new Date()}
                            disabled={(date) => date > new Date()}
                            className="w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium text-black">To</p>
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
                            endMonth={new Date()}
                            disabled={(date) => date > new Date()}
                            className="w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-3 py-3">
                  <Input
                    value={row.platform}
                    onChange={(event) =>
                      updateRow(row.id, "platform", event.target.value)
                    }
                    placeholder="Platform"
                    className="h-9 text-xs"
                  />
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
                    className="h-9 text-xs"
                  />
                </TableCell>

                <TableCell className="px-3 py-3">
                  <Input
                    value={row.amount}
                    onChange={(event) =>
                      updateRow(row.id, "amount", event.target.value)
                    }
                    placeholder="Amount"
                    className="h-9 text-xs"
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
          {formState.isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}
