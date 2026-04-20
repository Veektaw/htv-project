import { cookies } from "next/headers";
import {
  decrypt,
  REFRESH_TOKEN,
  setCookie,
  USER_SESSION_KEY,
} from "@/services/auth/user-session";
import { RefreshTokensResponse, UserSession } from "@/types/auth";

/**
 * Enhanced Token Refresh Endpoint
 *
 * POST /api/auth/refresh
 *
 * Handles token refresh requests with:
 * - Refresh token validation
 * - Backend coordination
 * - Token rotation support
 * - Comprehensive error handling
 * - Proper HTTP status codes
 *
 * Returns:
 * - 200 OK with new tokens on success
 * - 401 Unauthorized if refresh token missing/invalid
 * - 503 Service Unavailable if backend unreachable
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

    // Validate refresh token exists
    if (!refreshToken) {
      console.log("[auth/refresh] No refresh token found in cookies");
      return Response.json(
        {
          error: "No refresh token",
          code: "MISSING_REFRESH_TOKEN",
        },
        { status: 401 },
      );
    }

    // Get current session
    const sessionCookie = cookieStore.get(USER_SESSION_KEY)?.value;
    const userSession = sessionCookie
      ? await decrypt<UserSession>(sessionCookie)
      : null;

    if (!userSession) {
      console.log("[auth/refresh] No user session found");
      // Clear invalid cookies
      cookieStore.delete(USER_SESSION_KEY);
      cookieStore.delete(REFRESH_TOKEN);
      console.log("[auth/refresh] Cleared auth cookies due to missing session");

      return Response.json(
        {
          error: "No user session",
          code: "NO_SESSION",
        },
        { status: 401 },
      );
    }

    // Call backend refresh endpoint
    const backendUrl = process.env.BASE_URL;
    if (!backendUrl) {
      console.error("[auth/refresh] Backend URL not configured");
      return Response.json(
        {
          error: "Backend configuration error",
          code: "BACKEND_ERROR",
        },
        { status: 503 },
      );
    }

    let refreshResponse: Response;
    try {
      refreshResponse = await fetch(`${backendUrl}/auth/refresh-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      console.error(
        "[auth/refresh] Backend fetch error:",
        isTimeout ? "timeout" : error,
      );

      return Response.json(
        {
          error: "Backend unreachable",
          code: "BACKEND_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    // Parse backend response
    let data: RefreshTokensResponse & { error?: string; detail?: string };
    try {
      data = await refreshResponse.json();
    } catch {
      console.error("[auth/refresh] Failed to parse backend response");
      return Response.json(
        {
          error: "Invalid backend response",
          code: "INVALID_RESPONSE",
        },
        { status: 503 },
      );
    }

    // Handle backend errors
    if (!refreshResponse.ok) {
      const errorMessage = data.error || data.detail || "Session expired";
      console.log("[auth/refresh] Backend returned error:", {
        status: refreshResponse.status,
        error: errorMessage,
      });

      // Clear invalid cookies on auth failure
      if (refreshResponse.status === 401 || refreshResponse.status === 403) {
        cookieStore.delete(USER_SESSION_KEY);
        cookieStore.delete(REFRESH_TOKEN);
        console.log(
          "[auth/refresh] Cleared auth cookies due to invalid refresh token",
        );
      }

      const statusCode =
        refreshResponse.status === 401 || refreshResponse.status === 403
          ? 401
          : 503;

      return Response.json(
        {
          error: errorMessage,
          code:
            refreshResponse.status === 401
              ? "INVALID_REFRESH_TOKEN"
              : "REFRESH_FAILED",
        },
        { status: statusCode },
      );
    }

    // Validate new tokens in response
    if (!data.access_token) {
      console.error("[auth/refresh] Backend returned no access token");
      return Response.json(
        {
          error: "Invalid token response",
          code: "MISSING_TOKEN",
        },
        { status: 503 },
      );
    }

    // Update cookies with new tokens
    const user = userSession.data.user;
    const newRefreshToken = data.refresh_token || refreshToken; // Use new refresh token if provided (rotation)

    await setCookie({
      user,
      accessToken: data.access_token,
      refreshToken: newRefreshToken,
    });

    console.log("[auth/refresh] Token refresh successful");

    return Response.json(
      {
        ok: true,
        accessToken: data.access_token,
        refreshToken: newRefreshToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[auth/refresh] Unexpected error:", error);
    return Response.json(
      {
        error: "Unable to process refresh request",
        code: "INTERNAL_ERROR",
      },
      { status: 503 },
    );
  }
}
