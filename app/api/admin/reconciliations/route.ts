import { NextRequest } from "next/server";
import { Api } from "@/services/apis/api";
import { createResponse } from "@/lib/route-handler";
import { GetDoctorReconciliations } from "@/types/reconciliations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = new URLSearchParams();

  const page = searchParams.get("page") || "1";
  params.set("page", page);

  const limit = searchParams.get("limit");
  const platform = searchParams.get("platform");
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const search = searchParams.get("search");

  if (limit) params.set("limit", limit);
  if (platform && platform.toLowerCase() !== "all")
    params.set("platform", platform);
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);
  if (search) params.set("keyword", search);

  const url = `/admin/reconciliation/?${params.toString()}`;

  // console.log({ url });

  try {
    const response = await Api.get<GetDoctorReconciliations>(url, true);

    // console.log({ response });

    if (!response.ok) {
      return Response.json(
        { error: response.body.message },
        { status: response.status },
      );
    }

    return createResponse(response);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
