import { NextRequest, NextResponse } from "next/server";
import { getPlatformsApi } from "@/services/apis/doctor-platforms.api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const response = await getPlatformsApi({
    page,
    limit,
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
