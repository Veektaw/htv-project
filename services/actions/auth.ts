"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  USER_SESSION_KEY,
  REFRESH_TOKEN,
  decrypt,
} from "@/services/auth/user-session";
import { UserSession } from "@/types/auth";

/**
 * Server Actions for Authentication
 *
 * These are "use server" functions that can be called from both:
 * - Server Components (directly)
 * - Client Components (as async functions)
 *
 * Server Actions allow us to WRITE cookies from server logic,
 * which is not possible directly in Server Components.
 *
 * They handle all cookie mutations safely.
 */

/**
 * Get the current user session (read-only)
 * Can be called from Server Components or Client Components
 *
 * @returns UserSession | null
 */
export async function getUserSessionAction(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(USER_SESSION_KEY)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = await decrypt<UserSession>(sessionCookie);
    return session;
  } catch {
    console.error("[getUserSessionAction] Failed to decrypt session");
    return null;
  }
}

/**
 * Get the current access token (read-only)
 * Can be called from Server Components or Client Components
 *
 * @returns Access token string | null
 */
export async function getAccessTokenAction(): Promise<string | null> {
  const session = await getUserSessionAction();
  return session?.data.accessToken ?? null;
}

/**
 * Check if user is authenticated (read-only)
 * Can be called from Server Components or Client Components
 *
 * @returns true if user has valid session and refresh token
 */
export async function isAuthenticatedAction(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = await getUserSessionAction();
  const hasRefreshToken = !!cookieStore.get(REFRESH_TOKEN)?.value;

  return !!session && hasRefreshToken;
}

/**
 * Logout the user
 *
 * This is a Server Action that:
 * 1. Clears all authentication cookies
 * 2. Notifies the backend (fire-and-forget)
 * 3. Redirects to sign-in page
 *
 * Can be called from:
 * - Server Components (directly)
 * - Client Components (as async function)
 * - API Routes
 *
 * @param redirectPath - Path to redirect to after logout (default: "/sign-in")
 */
export async function logoutAction(
  redirectPath: string = "/sign-in",
): Promise<never> {
  try {
    const cookieStore = await cookies();

    // Clear authentication cookies
    cookieStore.delete(USER_SESSION_KEY);
    cookieStore.delete(REFRESH_TOKEN);

    console.log("[logoutAction] Cleared authentication cookies");

    console.log("[logoutAction] Logout completed, redirecting");

    // Always redirect to the specified path
    redirect(redirectPath);
  } catch (error) {
    console.error("[logoutAction] Error during logout:", error);
    // Even on error, attempt to redirect
    redirect(redirectPath);
  }
}

/**
 * Clear all auth cookies without redirecting
 *
 * Useful for programmatic logout that doesn't immediately redirect.
 * After calling this, you should manually redirect or handle navigation.
 *
 * Can be called from:
 * - Server Components (directly)
 * - Client Components (as async function)
 * - API Routes
 *
 * @returns true if successfully cleared, false otherwise
 */
export async function clearAuthCookiesAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(USER_SESSION_KEY);
    cookieStore.delete(REFRESH_TOKEN);

    console.log("[clearAuthCookiesAction] Authentication cookies cleared");
    return true;
  } catch (error) {
    console.error("[clearAuthCookiesAction] Error clearing cookies:", error);
    return false;
  }
}

/**
 * Validate the current session
 * Can be called from Server Components or Client Components
 *
 * @returns Object with validation details
 */
export async function validateSessionAction(): Promise<{
  isValid: boolean;
  hasSession: boolean;
  hasRefreshToken: boolean;
}> {
  const session = await getUserSessionAction();
  const cookieStore = await cookies();
  const hasRefreshToken = !!cookieStore.get(REFRESH_TOKEN)?.value;

  return {
    isValid: !!session && hasRefreshToken,
    hasSession: !!session,
    hasRefreshToken,
  };
}
