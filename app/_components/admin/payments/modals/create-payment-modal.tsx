"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  createPaymentAction,
  getDoctorsAction,
  getInvoicesAction,
} from "@/services/actions/payments.actions";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { Invoice } from "@/types/invoices";
import { cn } from "@/lib/utils";
import { X, Calendar as CalendarIcon } from "lucide-react";

const createPaymentSchema = z.object({
  doctor_id: z.string().min(1, "Doctor is required"),
  invoice_id: z.string().min(1, "Invoice is required"),
  source: z.string().min(1, "Source is required"),
  amount_paid: z.string().min(0, "Amount paid must be positive"),
  description: z.string().min(1, "Description is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  payment_ref: z.string().min(1, "Payment reference is required"),
});

type CreatePaymentForm = z.infer<typeof createPaymentSchema>;

export default function CreatePaymentModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreatePaymentForm>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      payment_date: format(new Date(), "yyyy-MM-dd"),
      amount_paid: "0",
    },
  });

  const selectedDoctorId = watch("doctor_id");

  useEffect(() => {
    if (!open) return;
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const result = await getDoctorsAction();
        if (!result.error) setDoctors(result.doctors);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [open]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!selectedDoctorId) {
        setInvoices([]);
        return;
      }
      setLoadingInvoices(true);
      try {
        const result = await getInvoicesAction(selectedDoctorId);
        if (!result.error) setInvoices(result.invoices);
      } catch (error) {
        showToast("Failed to fetch invoices for the selected doctor", "error");
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchInvoices();
  }, [selectedDoctorId]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: CreatePaymentForm) => {
    setIsLoading(true);
    try {
      const selectedInvoice = invoices.find(
        (inv) => inv.id === data.invoice_id,
      );
      if (selectedInvoice && selectedInvoice.user_id !== data.doctor_id) {
        showToast(
          "Selected invoice does not belong to the selected doctor",
          "error",
        );
        return;
      }

      const formattedData = {
        ...data,
        amount_paid: Number(data.amount_paid),
      };

      const result = await createPaymentAction(formattedData);

      if (result.error) {
        showToast(result.message, "error");
      } else {
        showToast(result.message, "success");
        handleClose();
        router.refresh();
      }
    } catch {
      showToast("An error occurred while creating the payment", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedInvoice = invoices.find(
    (inv) => inv.id === watch("invoice_id"),
  );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="h-9 px-13"
        onClick={() => setOpen(true)}
      >
        Create Payment
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Payment
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Doctor name */}
            {selectedDoctor && (
              <div className="px-8 pb-2 text-right text-sm font-semibold text-gray-800">
                {selectedDoctor.full_name}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mx-8 mb-6 space-y-5 rounded-xl border border-gray-200 p-6">
                {/* Row 1: User ID + Date */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      User ID
                    </label>
                    <Select
                      value={watch("doctor_id")}
                      onValueChange={(value) => {
                        setValue("doctor_id", value);
                        setValue("invoice_id", "");
                      }}
                    >
                      <SelectTrigger
                        disabled={loadingDoctors}
                        className="h-11! w-full rounded-lg border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-black"
                      >
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.doctor_id && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.doctor_id.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Date
                    </label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start rounded-lg border border-gray-200 bg-white text-left text-sm font-normal text-gray-800 focus:ring-2 focus:ring-black",
                            !watch("payment_date") && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch("payment_date") ? (
                            format(new Date(watch("payment_date")), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            watch("payment_date")
                              ? new Date(watch("payment_date"))
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              setValue(
                                "payment_date",
                                format(date, "yyyy-MM-dd"),
                              );
                              setCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.payment_date && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.payment_date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Invoice ID + Payment REF */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Invoice ID
                    </label>
                    <Select
                      value={watch("invoice_id")}
                      onValueChange={(value) => setValue("invoice_id", value)}
                      disabled={!selectedDoctorId}
                    >
                      <SelectTrigger
                        title={
                          !selectedDoctorId ? "Select a doctor" : undefined
                        }
                        className="h-11! w-full rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                      >
                        <SelectValue placeholder="Select an invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingInvoices ? (
                          <SelectItem
                            value="no value"
                            className="flex h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-400"
                          >
                            Loading invoices...
                          </SelectItem>
                        ) : invoices.length === 0 ? (
                          <SelectItem
                            value="no value"
                            className="flex h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-400"
                          >
                            No invoices for this doctor
                          </SelectItem>
                        ) : (
                          invoices.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.invoice_ref}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    {errors.invoice_id && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.invoice_id.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Payment REF
                    </label>
                    <Input
                      {...register("payment_ref")}
                      placeholder="Enter payment reference"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.payment_ref && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.payment_ref.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Description + Amount + Source */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Description
                    </label>
                    <Input
                      {...register("description")}
                      placeholder="Enter description"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Source
                    </label>
                    <Input
                      {...register("source")}
                      placeholder="Enter payment source"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.source && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.source.message}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Line Items Table */}
                {selectedInvoice && (
                  <div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="w-12 rounded-tl-lg px-4 py-3 text-left text-xs font-medium text-gray-600">
                            S/N
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Platform
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Description
                          </th>
                          <th className="rounded-tr-lg px-4 py-3 text-right text-xs font-medium text-gray-600">
                            Amount ($)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-4 pt-5 align-top text-xs text-gray-500">
                            01
                          </td>
                          <td className="px-4 py-4 align-top">
                            <input
                              type="text"
                              value={selectedInvoice?.platform || ""}
                              disabled
                              className="w-full bg-transparent text-sm text-gray-700 focus:outline-none disabled:text-gray-500"
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <input
                              type="text"
                              value={selectedInvoice?.notes || ""}
                              disabled
                              className="w-full bg-transparent text-sm text-gray-700 focus:outline-none disabled:text-gray-500"
                            />
                          </td>
                          <td className="px-4 py-4 text-right align-top">
                            <input
                              type="text"
                              value={selectedInvoice?.amount || ""}
                              disabled
                              className="w-full bg-transparent text-right text-sm text-gray-700 focus:outline-none disabled:text-gray-500"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Amount Paid ($)
                      </span>
                      <Input
                        type="number"
                        {...register("amount_paid", { valueAsNumber: false })}
                        placeholder="0.00"
                        className="h-8 w-32 rounded-lg border-gray-200 text-right text-sm focus:ring-2 focus:ring-black"
                      />
                    </div>
                    {errors.amount_paid && (
                      <p className="text-right text-xs text-red-500">
                        {errors.amount_paid.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 px-8 pb-7">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-11 rounded-full border-gray-300 px-8 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 rounded-full bg-gray-900 px-8 text-white hover:bg-black"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
