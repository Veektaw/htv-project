import { InvoiceComment } from "@/types/invoices";

export const getReconciliationComments = async (
  reconciliationId: string,
): Promise<{
  status: number;
  data: InvoiceComment[];
}> => {
  const url = `/api/doctor/comments/reconciliations/${reconciliationId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not successful");
  }
  return response.json();
};
