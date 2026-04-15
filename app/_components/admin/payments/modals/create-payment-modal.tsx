"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
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
  amount_paid: z.number().min(0, "Amount paid must be positive"),
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
    },
  });

  const selectedDoctorId = watch("doctor_id");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const result = await getDoctorsAction();
        if (!result.error) {
          setDoctors(result.doctors);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (open) {
      fetchDoctors();
    }
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
        if (!result.error) {
          setInvoices(result.invoices);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, [selectedDoctorId]);

  const onSubmit = async (data: CreatePaymentForm) => {
    setIsLoading(true);
    try {
      const selectedInvoice = invoices.find((inv) => inv.id === data.invoice_id);
      if (selectedInvoice && selectedInvoice.user_id !== data.doctor_id) {
        console.error("Selected invoice does not belong to the selected doctor");
        return;
      }

      const result = await createPaymentAction(data);
      if (result.error) {
        // toast.error(result.message);
      } else {
        // toast.success(result.message);
        setOpen(false);
        reset();
        router.refresh();
      }
    } catch {
      // toast.error("An error occurred while creating the payment");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedInvoice = invoices.find((inv) => inv.id === watch("invoice_id"));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Create Payment</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Payment</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
              {/* Info Card */}
              <div className="mx-8 mb-6 border border-gray-200 rounded-xl p-6 space-y-5">
                {/* Row 1: User ID + Date */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">User ID</label>
                    <Select
                      value={watch("doctor_id")}
                      onValueChange={(value) => {
                        setValue("doctor_id", value);
                        setValue("invoice_id", "");
                      }}
                    >
                      <SelectTrigger
                        disabled={loadingDoctors}
                        className="h-11 rounded-lg border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-black"
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
                      <p className="text-xs text-red-500 mt-1">{errors.doctor_id.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Date</label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start text-left font-normal rounded-lg border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-black",
                            !watch("payment_date") && "text-muted-foreground"
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
                          selected={watch("payment_date") ? new Date(watch("payment_date")) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setValue("payment_date", format(date, "yyyy-MM-dd"));
                              setCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.payment_date && (
                      <p className="text-xs text-red-500 mt-1">{errors.payment_date.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Invoice ID + Payment REF */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Invoice ID</label>
                    {!selectedDoctorId ? (
                      <div className="h-11 flex items-center px-3 rounded-lg border border-gray-200 text-sm text-gray-400">
                        Select a doctor first
                      </div>
                    ) : loadingInvoices ? (
                      <div className="h-11 flex items-center px-3 rounded-lg border border-gray-200 text-sm text-gray-400">
                        Loading invoices...
                      </div>
                    ) : invoices.length === 0 ? (
                      <div className="h-11 flex items-center px-3 rounded-lg border border-gray-200 text-sm text-gray-400">
                        No invoices for this doctor
                      </div>
                    ) : (
                      <Select
                        value={watch("invoice_id")}
                        onValueChange={(value) => setValue("invoice_id", value)}
                      >
                        <SelectTrigger className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black">
                          <SelectValue placeholder="Select an invoice" />
                        </SelectTrigger>
                        <SelectContent>
                          {invoices.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.invoice_ref}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.invoice_id && (
                      <p className="text-xs text-red-500 mt-1">{errors.invoice_id.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Payment REF</label>
                    <Input
                      {...register("payment_ref")}
                      placeholder="Enter payment reference"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.payment_ref && (
                      <p className="text-xs text-red-500 mt-1">{errors.payment_ref.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Payment Date + Source */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Payment Date</label>
                    <Input
                      {...register("description")}
                      placeholder="Enter description"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>
                   <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Amount</label>
                    <Input
                        type="number"
                      {...register("amount_paid", { valueAsNumber: true })}
                      placeholder="Enter amount"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.amount_paid && (
                      <p className="text-xs text-red-500 mt-1">{errors.amount_paid.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Source</label>
                    <Input
                      {...register("source")}
                      placeholder="Enter payment source"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.source && (
                      <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Line Items Table - Only show when invoice is selected */}
                {selectedInvoice && (
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left text-xs font-medium text-gray-600 px-4 py-3 rounded-tl-lg w-12">S/N</th>
                        <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Platform</th>
                        <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Description</th>
                        <th className="text-right text-xs font-medium text-gray-600 px-4 py-3 rounded-tr-lg">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-4 text-gray-500 text-xs align-top pt-5">
                          01
                        </td>
                        <td className="px-4 py-4 align-top">
                          <input
                            type="text"
                            placeholder="Platform"
                            value={selectedInvoice?.platform || ""}
                            disabled={!!selectedInvoice}
                            className="w-full text-sm text-gray-700 focus:outline-none disabled:text-gray-500 bg-transparent"
                          />
                        </td>
                        <td className="px-4 py-4 align-top">
                          <input
                            type="text"
                            placeholder="Description"
                            value={selectedInvoice?.notes || ""}
                            disabled={!!selectedInvoice}
                            className="w-full text-sm text-gray-700 focus:outline-none disabled:text-gray-500 bg-transparent"
                          />
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={selectedInvoice?.amount || ""}
                            disabled={!!selectedInvoice}
                            className="w-full text-sm text-gray-700 focus:outline-none disabled:text-gray-500 bg-transparent text-right"
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
                      <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sum Total ($)</span>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("amount_paid", { valueAsNumber: true })}
                        placeholder="0.00"
                        className="w-32 h-8 text-right text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                      />
                    </div>
                    {errors.amount_paid && (
                      <p className="text-xs text-red-500 text-right">{errors.amount_paid.message}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gross Total ($)</span>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("amount_paid", { valueAsNumber: true })}
                        placeholder="0.00"
                        className="w-32 h-8 text-right text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                      />
                    </div>
                    {errors.amount_paid && (
                      <p className="text-xs text-red-500 text-right">{errors.amount_paid.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 px-8 pb-7">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-8 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full px-8 h-11 bg-gray-900 hover:bg-black text-white"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dialog>
  );
}