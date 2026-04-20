import "server-only";

import { redirect } from "next/navigation";
import {
  setCookie,
  getUserSession as getSessionFromCookie,
  getRefreshToken as getRefreshTokenFromCookie,
  USER_SESSION_KEY,
  REFRESH_TOKEN,
} from "./user-session";
import { TokenManager, TokenState } from "./token-manager";
import { AuthError, AuthErrorType } from "@/lib/auth-errors";
import {
  RefreshTokensResponse,
  UserSession,
  UserSessionData,
} from "@/types/auth";
import { cookies } from "next/headers";

/**
 * Enhanced Auth Service
 *
 * Centralized authentication management with:
 * - Session management with token lifecycle tracking
 * - Coordinated token refresh with concurrency prevention
 * - Graceful logout with proper cleanup
 * - Clear error categorization for consumer code
 */
export class AuthService {
  /**
   * Get the current user session
   * Wrapper around cookie-based session retrieval
   *
   * @returns UserSession or null if not available
   */
  static async getUserSession(): Promise<UserSession | null> {
    return await getSessionFromCookie();
  }

  /**
   * Get the current user data from session
   * Convenience method for accessing user info
   *
   * @returns UserSessionData or null
   */
  static async getUserData(): Promise<UserSessionData | null> {
    const session = await this.getUserSession();
    return session?.data.user ?? null;
  }

  /**
   * Get the current access token
   * Delegates to TokenManager for consistency
   *
   * @returns Access token or null
   */
  static async getAccessToken(): Promise<string | null> {
    return await TokenManager.getAccessToken();
  }

  /**
   * Get the current refresh token
   * Delegates to TokenManager for consistency
   *
   * @returns Refresh token or null
   */
  static async getRefreshToken(): Promise<string | null> {
    return await getRefreshTokenFromCookie();
  }

  /**
   * Check if user has a valid refresh token
   * @returns true if refresh token exists
   */
  static async hasRefreshToken(): Promise<boolean> {
    return await TokenManager.hasRefreshToken();
  }

  /**
   * Attempt to refresh the access token using the refresh token
   *
   * This method:
   * 1. Checks if a refresh is already in progress (prevents concurrent requests)
   * 2. Validates that a refresh token exists
   * 3. Calls the backend refresh endpoint
   * 4. Updates session cookies with new tokens
   * 5. Handles various error scenarios with proper error types
   *
   * @returns true if refresh was successful, false otherwise
   * @throws AuthError with specific error type for different failure modes
   */
  static async refreshTokens(): Promise<boolean> {
    try {
      // Check if another refresh is in progress
      const lockAcquired = await TokenManager.acquireRefreshLock();

      if (!lockAcquired) {
        // Another refresh is in progress, wait for it
        TokenManager.logTokenEvent(
          "Refresh already in progress, waiting for completion",
        );
        return await TokenManager.waitForRefreshCompletion();
      }

      try {
        TokenManager.logTokenEvent("Attempting token refresh");

        // Get current session and refresh token
        const session = await this.getUserSession();
        const refreshToken = await this.getRefreshToken();

        // Validate refresh token exists
        if (!refreshToken) {
          TokenManager.logTokenEvent("No refresh token available");
          throw new AuthError(
            AuthErrorType.MISSING_REFRESH_TOKEN,
            "Refresh token not available",
            401,
          );
        }

        // Validate session exists
        if (!session) {
          TokenManager.logTokenEvent("No user session found");
          throw new AuthError(
            AuthErrorType.SESSION_EXPIRED,
            "User session not found",
            401,
          );
        }

        // Call backend refresh endpoint
        const backendUrl = process.env.BASE_URL;
        if (!backendUrl) {
          throw new AuthError(
            AuthErrorType.REFRESH_FAILED,
            "Backend URL not configured",
            503,
          );
        }

        let refreshResponse: Response;
        try {
          refreshResponse = await fetch(`${backendUrl}/auth/refresh-token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
            // Add timeout for refresh request
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new AuthError(
              AuthErrorType.REFRESH_NETWORK_ERROR,
              "Token refresh request timed out",
              503,
            );
          }
          throw new AuthError(
            AuthErrorType.REFRESH_NETWORK_ERROR,
            "Failed to reach backend for token refresh",
            503,
            { originalError: error },
          );
        }

        // Handle non-OK responses
        if (!refreshResponse.ok) {
          TokenManager.logTokenEvent("Refresh endpoint returned error", {
            status: refreshResponse.status,
          });

          // Clear tokens on auth failure
          await this.clearAuthCookies();

          if (
            refreshResponse.status === 401 ||
            refreshResponse.status === 403
          ) {
            throw new AuthError(
              AuthErrorType.INVALID_REFRESH_TOKEN,
              "Refresh token is invalid or expired",
              401,
            );
          }

          throw new AuthError(
            AuthErrorType.REFRESH_FAILED,
            "Token refresh failed",
            refreshResponse.status,
          );
        }

        // Parse refresh response
        let refreshData: RefreshTokensResponse;
        try {
          refreshData = await refreshResponse.json();
        } catch {
          throw new AuthError(
            AuthErrorType.REFRESH_INVALID_RESPONSE,
            "Invalid refresh response format",
            503,
          );
        }

        // Validate response contains required tokens
        if (!refreshData.access_token) {
          throw new AuthError(
            AuthErrorType.REFRESH_INVALID_RESPONSE,
            "No access token in refresh response",
            503,
          );
        }

        // Update session with new tokens
        const user = session.data.user;
        await setCookie({
          user,
          accessToken: refreshData.access_token,
          refreshToken: refreshData.refresh_token || refreshToken,
        });

        TokenManager.logTokenEvent("Token refresh successful");
        return true;
      } finally {
        // Always release lock after refresh attempt completes
        TokenManager.releaseRefreshLock(true);
      }
    } catch (error) {
      TokenManager.releaseRefreshLock(false);

      if (error instanceof AuthError) {
        throw error;
      }

      console.error("[AuthService] Unexpected error during refresh:", error);
      throw new AuthError(
        AuthErrorType.UNKNOWN_ERROR,
        "Unexpected error during token refresh",
        500,
        { originalError: error },
      );
    }
  }

  /**
   * Perform user logout
   *
   * IMPORTANT: This should ONLY be called from:
   * - API Routes (POST /api/auth/logout)
   * - Server Actions
   *
   * It cannot be called directly from Server Components because cookies
   * can only be READ in Server Components, not written.
   *
   * This method:
   * 1. Clears all authentication cookies (via API endpoint or Server Action)
   * 2. Optionally notifies the backend (for session revocation)
   * 3. Logs the logout event
   *
   * @param redirectPath - Optional path to redirect to (usually "/sign-in")
   */
  static async logout(redirectPath?: string): Promise<void> {
    try {
      TokenManager.logTokenEvent("User logout initiated");

      // NOTE: Cookie clearing must happen in an API route or Server Action
      // Call the logout API endpoint which handles cookie clearing
      try {
        const baseUrl =
          process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
        if (baseUrl) {
          // Call Next.js logout API route
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });
        }
      } catch (error) {
        // Log but don't block logout on API errors
        console.error("[AuthService] Error calling logout endpoint:", error);
      }

      TokenManager.logTokenEvent("Logout completed");

      // Redirect if specified
      if (redirectPath) {
        redirect(redirectPath);
      }
    } catch (error) {
      console.error("[AuthService] Error during logout:", error);
      // Even if something fails, attempt redirect as fallback
      if (redirectPath) {
        redirect(redirectPath);
      }
    }
  }

  /**
   * Clear all authentication cookies
   *
   * IMPORTANT: This method CANNOT be called directly from server components.
   * It is exported for use within API routes and Server Actions only.
   *
   * Server components can READ cookies with cookies() but cannot WRITE them.
   * Cookie writing must happen in:
   * - API Routes
   * - Server Actions
   *
   * @private
   */
  static async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(USER_SESSION_KEY, "", { expires: new Date(0) });
    cookieStore.set(REFRESH_TOKEN, "", { expires: new Date(0) });
  }

  /**
   * Validate the current session state
   * Checks if tokens exist and are not expired
   *
   * @returns Object with validation details
   */
  static async validateSession(): Promise<{
    isValid: boolean;
    session: UserSession | null;
    hasRefreshToken: boolean;
    accessTokenState: TokenState;
  }> {
    const session = await this.getUserSession();
    const hasRefreshToken = await this.hasRefreshToken();
    const tokenValidation = await TokenManager.validateAccessToken();

    return {
      isValid: session !== null && tokenValidation.state === TokenState.VALID,
      session,
      hasRefreshToken,
      accessTokenState: tokenValidation.state,
    };
  }
}

// Re-export commonly used functions for backward compatibility
export const getUserSession = () => AuthService.getUserSession();
export const getRefreshToken = () => AuthService.getRefreshToken();
export const logout = (redirectPath?: string) =>
  AuthService.logout(redirectPath);
export const getUser = async (): Promise<UserSessionData> => {
  const userData = await AuthService.getUserData();
  if (!userData) {
    redirect("/sign-in");
  }
  return userData;
};
