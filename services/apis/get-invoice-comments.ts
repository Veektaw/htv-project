import { InvoiceComment } from "@/types/invoices";

export const getInvoiceComments = async (
  invoiceId: string,
): Promise<{
  status: number;
  data: InvoiceComment[];
}> => {
  const url = `/api/doctor/comments/invoices/${invoiceId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not successful");
  }
  return response.json();
};
