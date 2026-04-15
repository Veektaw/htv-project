import { NextResponse } from "next/server";
import { ResponseType } from "@/types/api";

// lib/route-handler.ts
export function createResponse<R>(res: ResponseType<R>) {
  const response = NextResponse.json({
    status: res.status,
    data: res.body,
  });

  res.setCookieHeaders?.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });

  console.log({ cook: response.cookies.getAll() });

  return response;
}
