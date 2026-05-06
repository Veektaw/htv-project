import { NextRequest, NextResponse } from "next/server";
import { getDoctorPrescriptionsApi } from "@/services/apis/prescriptions.api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const platform = searchParams.get("platform") || undefined;
  const start_date = searchParams.get("start_date") || undefined;
  const end_date = searchParams.get("end_date") || undefined;

  const response = await getDoctorPrescriptionsApi({
    page,
    limit,
    platform,
    start_date,
    end_date,
  });

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
