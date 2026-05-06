"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { manualInvoiceFormSchema, ManualInvoiceSchemaType } from "../schemas";

export default function useManualInvoice({
  defaultValues,
}: {
  defaultValues?: Partial<ManualInvoiceSchemaType>;
} = {}) {
  const { refresh } = useRouter();

  const form = useForm<ManualInvoiceSchemaType>({
    resolver: zodResolver(manualInvoiceFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { formState, reset, control } = form;

  return {
    form,
    control,
    formState,
    reset,
    refresh,
  };
}
