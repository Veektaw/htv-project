"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { manualInvoiceFormSchema, ManualInvoiceSchemaType } from "../schemas";
import { showToast } from "@/lib/toast";
import { createManualInvoiceAction } from "@/services/actions/invoices.actions";

export default function useManualInvoice() {
  const { refresh } = useRouter();

  const form = useForm<ManualInvoiceSchemaType>({
    resolver: zodResolver(manualInvoiceFormSchema),
    defaultValues: {
      userId: "",
      invoiceId: "",
      dateTime: "",
    },
  });

  const { handleSubmit, formState, reset, control } = form;

  const onSubmit = async (data: ManualInvoiceSchemaType) => {
    try {
      const res = await createManualInvoiceAction(data);

      if (!res.error) {
        refresh();
        showToast(res.message);
        reset();
      } else {
        showToast(res.message, "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  return {
    form,
    control,
    onSubmit: handleSubmit(onSubmit),
    formState,
    reset,
  };
}
