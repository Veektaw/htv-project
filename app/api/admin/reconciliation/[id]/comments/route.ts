import { NextResponse } from "next/server";
import { getReconciliationCommentsApi } from "@/services/apis/reconciliations.api";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await getReconciliationCommentsApi(id);

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
