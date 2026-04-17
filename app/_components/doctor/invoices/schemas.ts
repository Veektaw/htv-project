import z from "zod";

export const manualInvoiceFormSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  invoiceId: z.string().optional(),
  dateTime: z.string().optional(),
  platform: z.string(),
  amount: z.number(),
  adyenPaid: z.string().optional(),
  period_month: z.string(),
});

export type ManualInvoiceSchemaType = z.infer<typeof manualInvoiceFormSchema>;
