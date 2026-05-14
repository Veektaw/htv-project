import z from "zod";

export const manualInvoiceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  bill_from_address: z.string().min(1, "Bill to address is required"),
  dateTime: z.string().min(1, "Date is required"),
  platform: z.string().min(1, "Platform is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  adyenPaid: z.string().optional(),
  period_month: z.string().min(1, "Period is required"),
});

export type ManualInvoiceSchemaType = z.infer<typeof manualInvoiceFormSchema>;
