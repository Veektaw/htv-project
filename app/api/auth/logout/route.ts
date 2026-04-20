import { cookies } from "next/headers";
import { USER_SESSION_KEY, REFRESH_TOKEN } from "@/services/auth/user-session";

/**
 * Logout Endpoint
 *
 * POST /api/auth/logout
 *
 * This endpoint handles the actual cookie clearing operation.
 * It MUST be used because cookies can only be set/deleted in API routes,
 * not in Server Components.
 *
 * Called by:
 * - AuthService.logout() when invoked from Server Actions
 * - Client-side logout handlers
 * - Token refresh failure handlers
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete authentication cookies
    cookieStore.delete(USER_SESSION_KEY);
    cookieStore.delete(REFRESH_TOKEN);

    console.log("[auth/logout] User logged out, cookies cleared");

    return Response.json(
      {
        ok: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[auth/logout] Error during logout:", error);

    return Response.json(
      {
        ok: false,
        error: "Logout failed",
        code: "LOGOUT_ERROR",
      },
      { status: 500 },
    );
  }
}
