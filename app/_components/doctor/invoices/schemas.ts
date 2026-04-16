import z from "zod";

export const manualInvoiceFormSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  invoiceId: z.string().nonempty("Invoice ID is required"),
  dateTime: z.string().nonempty("Date/time is required"),
});

export type ManualInvoiceSchemaType = z.infer<typeof manualInvoiceFormSchema>;
