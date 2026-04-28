"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { brandPartners as platformOptions } from "@/lib/constants";
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
import { getDoctorsAction } from "@/services/actions/payments.actions";
import { manualReconciliationAction } from "@/services/actions/reconciliations.actions";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";
import { X, Calendar as CalendarIcon } from "lucide-react";

const createReconciliationSchema = z.object({
  doctor_id: z.string().min(1, "Doctor is required"),
  platform: z.string().min(1, "Platform is required"),
  gross_amount: z
    .string()
    .min(1, "Gross amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
      message: "Must be a positive number",
    }),
  adyen_paid: z
    .string()
    .min(1, "Adyen paid is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
      message: "Must be a positive number",
    }),
  outstanding: z
    .string()
    .min(1, "Outstanding is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
      message: "Must be a positive number",
    }),
  manual_paid: z
    .string()
    .min(1, "Manual paid is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
      message: "Must be a positive number",
    }),
  period_month: z.string().min(1, "Period month is required"),
  note: z.string(),
  comment: z.string(),
});

type CreateReconciliationForm = z.infer<typeof createReconciliationSchema>;

export default function CreateReconciliationModal({}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateReconciliationForm>({
    resolver: zodResolver(createReconciliationSchema),
    defaultValues: {
      gross_amount: "0",
      adyen_paid: "0",
      outstanding: "0",
      manual_paid: "0",
      period_month: format(new Date(), "yyyy-MM"),
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

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: CreateReconciliationForm) => {
    setIsLoading(true);
    try {
      const { doctor_id, ...rest } = data;

      const payload = {
        platform: rest.platform,
        gross_amount: parseFloat(rest.gross_amount), // remove the double parseFloat
        adyen_paid: parseFloat(rest.adyen_paid),
        outstanding: parseFloat(rest.outstanding),
        manual_paid: parseFloat(rest.manual_paid),
        period_month: rest.period_month,
        note: rest.note || "",
        comment: rest.comment || "",
      };

      console.log("Payload:", payload);
      // const payload = {
      //   platform: rest.platform,
      //   gross_amount: parseFloat(parseFloat(rest.gross_amount).toFixed(2)),
      //   adyen_paid: parseFloat(parseFloat(rest.adyen_paid).toFixed(2)),
      //   outstanding: parseFloat(parseFloat(rest.outstanding).toFixed(2)),
      //   manual_paid: parseFloat(parseFloat(rest.manual_paid).toFixed(2)),
      //   period_month: rest.period_month,
      //   note: rest.note || "", // Optional fields can be empty strings
      //   comment: rest.comment || "", // Optional fields can be empty strings
      // };

      const result = await manualReconciliationAction(doctor_id, payload);

      if (result.error) {
        showToast(result.message, "error");
      } else {
        showToast(result.message, "success");
        handleClose();
        router.refresh();
      }
    } catch {
      showToast("An error occurred while creating the reconciliation", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const periodMonthValue = watch("period_month");
  const periodMonthDisplay = periodMonthValue
    ? format(new Date(`${periodMonthValue}-01`), "MMMM yyyy")
    : null;

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="h-9 px-13"
        onClick={() => setOpen(true)}
      >
        Create Reconciliation
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-8 pt-7 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Reconciliation
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {selectedDoctor && (
              <div className="px-8 pb-2 text-right text-sm font-semibold text-gray-800">
                {selectedDoctor.full_name}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mx-8 mb-6 space-y-5 rounded-xl border border-gray-200 p-6">
                {/* Row 1: Doctor + Period Month */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      User ID
                    </label>
                    <Select
                      value={watch("doctor_id")}
                      onValueChange={(value) => setValue("doctor_id", value)}
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
                      Period Month
                    </label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start rounded-lg border border-gray-200 bg-white text-left text-sm font-normal text-gray-800 focus:ring-2 focus:ring-black",
                            !periodMonthDisplay && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {periodMonthDisplay ?? <span>Pick a month</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0" align="start">
                        <Calendar
                          mode="single"
                          className="w-full"
                          selected={
                            periodMonthValue
                              ? new Date(`${periodMonthValue}-01`)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              setValue("period_month", format(date, "yyyy-MM"));
                              setCalendarOpen(false);
                            }
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.period_month && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.period_month.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Platform */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Platform
                    </label>
                    <Select
                      value={watch("platform")}
                      onValueChange={(value) => setValue("platform", value)}
                    >
                      <SelectTrigger className="h-11! w-full rounded-lg border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-black">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.platform && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.platform.message}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Amounts Table */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="rounded-tl-lg px-4 py-3 text-left text-xs font-medium text-gray-600">
                          Field
                        </th>
                        <th className="rounded-tr-lg px-4 py-3 text-right text-xs font-medium text-gray-600">
                          Amount (€)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          {
                            key: "gross_amount",
                            label: "Commission",
                          },
                          {
                            key: "adyen_paid",
                            label: "Adyen Paid",
                          },
                          {
                            key: "outstanding",
                            label: "Outstanding",
                          },
                          {
                            key: "manual_paid",
                            label: "Manual Paid",
                          },
                        ] as const
                      ).map(({ key, label }) => (
                        <tr
                          key={key}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {label}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...register(key)}
                              placeholder="0.00"
                              className="ml-auto h-8 w-36 rounded-lg border-gray-200 text-right text-sm focus:ring-2 focus:ring-black"
                            />
                            {errors[key] && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors[key]?.message}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr className="border-gray-200" />
                <div>
                  <label className="mb-1.5 block text-xs text-gray-500">
                    Note
                  </label>
                  <textarea
                    {...register("note")}
                    placeholder="Enter note"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 transition outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                  {errors.note && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.note.message}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="mb-1.5 block text-xs text-gray-500">
                    Comment
                  </label>
                  <textarea
                    {...register("comment")}
                    placeholder="Enter comment"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 transition outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                  {errors.comment && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.comment.message}
                    </p>
                  )}
                </div>
                {/* Row: Note + Comment */}
                {/* <div className="grid grid-cols-2 gap-6"> */}
                {/* <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Note
                    </label>
                    <Input
                      {...register("note")}
                      placeholder="Enter note"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.note && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.note.message}
                      </p>
                    )}
                  </div> */}
                {/* <div>
                    <label className="mb-1.5 block text-xs text-gray-500">
                      Comment
                    </label>
                    <Input
                      {...register("comment")}
                      placeholder="Enter comment"
                      className="h-11 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-black"
                    />
                    {errors.comment && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.comment.message}
                      </p>
                    )}
                  </div> */}
                {/* </div> */}
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
