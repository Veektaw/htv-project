import { NextResponse } from "next/server";
import { getInvoiceCommentsApi } from "@/services/apis/doctor-invoices.api";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await getInvoiceCommentsApi(id);

  if (!response.ok) {
    return NextResponse.json({
      status: response.status,
      message: response.body.message,
    });
  } else {
    return NextResponse.json({
      status: response.status,
      data: response.body,
    });
  }
}
