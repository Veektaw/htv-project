import "server-only";

import { getUserSession, getRefreshToken } from "./user-session";

/**
 * Token state enumeration for tracking refresh lifecycle
 */
export enum TokenState {
  VALID = "VALID",
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
  MISSING = "MISSING",
}

/**
 * Token validation result with state and expiration details
 */
export interface TokenValidationResult {
  state: TokenState;
  token: string | null;
  expiresAt?: number;
  isExpiring?: boolean; // Within 5 minutes of expiration
}

/**
 * Refresh state to track and prevent concurrent refresh attempts
 */
let refreshInProgress = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Token Manager Service
 *
 * Handles centralized token lifecycle management with:
 * - Token validation and expiration detection
 * - Refresh state tracking to prevent concurrent requests
 * - Clear error categorization
 * - Structured token retrieval and validation
 */
export class TokenManager {
  /**
   * Get the current access token from session
   * @returns The access token or null if not available
   */
  static async getAccessToken(): Promise<string | null> {
    const session = await getUserSession();
    return session?.data.accessToken ?? null;
  }

  /**
   * Get the current refresh token
   * @returns The refresh token or null if not available
   */
  static async getRefreshToken(): Promise<string | null> {
    return await getRefreshToken();
  }

  /**
   * Check if a refresh token exists
   * @returns True if refresh token exists and is not empty
   */
  static async hasRefreshToken(): Promise<boolean> {
    const token = await getRefreshToken();
    return !!token && token.length > 0;
  }

  /**
   * Validate the current access token
   * Checks for existence and performs basic validation
   *
   * @returns TokenValidationResult with detailed state information
   */
  static async validateAccessToken(): Promise<TokenValidationResult> {
    try {
      const token = await this.getAccessToken();

      if (!token) {
        return {
          state: TokenState.MISSING,
          token: null,
        };
      }

      // Basic JWT structure validation (3 parts separated by dots)
      const parts = token.split(".");
      if (parts.length !== 3) {
        return {
          state: TokenState.INVALID,
          token: null,
        };
      }

      // Decode the payload (second part) to check expiration
      try {
        const payload = JSON.parse(atob(parts[1]));
        const expiresAt = payload.exp ? payload.exp * 1000 : null;
        const now = Date.now();

        if (expiresAt && expiresAt < now) {
          return {
            state: TokenState.EXPIRED,
            token,
            expiresAt,
          };
        }

        // Check if token is expiring soon (within 5 minutes)
        const isExpiring = expiresAt ? expiresAt - now < 5 * 60 * 1000 : false;

        return {
          state: TokenState.VALID,
          token,
          expiresAt: expiresAt ? expiresAt : undefined,
          isExpiring,
        };
      } catch {
        return {
          state: TokenState.INVALID,
          token,
        };
      }
    } catch (error) {
      console.error("[TokenManager] Error validating access token:", error);
      return {
        state: TokenState.INVALID,
        token: null,
      };
    }
  }

  /**
   * Check if a refresh attempt is currently in progress
   * Prevents multiple concurrent refresh requests
   *
   * @returns True if refresh is in progress
   */
  static isRefreshInProgress(): boolean {
    return refreshInProgress;
  }

  /**
   * Acquire the refresh lock
   * Returns a promise that resolves when refresh is complete
   *
   * @returns Promise<boolean> - true if lock was acquired, false if already in progress
   */
  static async acquireRefreshLock(): Promise<boolean> {
    if (refreshInProgress && refreshPromise) {
      // Wait for ongoing refresh to complete
      await refreshPromise;
      return false; // Lock was not acquired by this call
    }

    refreshInProgress = true;
    return true; // Lock acquired
  }

  /**
   * Release the refresh lock and resolve any waiting promises
   * Called after refresh attempt completes (success or failure)
   *
   * @param success - Whether the refresh was successful
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static releaseRefreshLock(success: boolean): void {
    refreshInProgress = false;
    refreshPromise = null;
  }

  /**
   * Set the refresh promise for other concurrent requests to wait on
   * @param promise - The promise of the refresh attempt
   */
  static setRefreshPromise(promise: Promise<boolean>): void {
    refreshPromise = promise;
  }

  /**
   * Wait for an ongoing refresh to complete
   * Used by concurrent requests that arrive during refresh
   *
   * @returns Promise<boolean> - true if refresh was successful
   */
  static async waitForRefreshCompletion(): Promise<boolean> {
    if (!refreshPromise) {
      return false;
    }
    return await refreshPromise;
  }

  /**
   * Reset refresh state completely
   * Useful for testing or emergency resets
   */
  static resetRefreshState(): void {
    refreshInProgress = false;
    refreshPromise = null;
  }

  /**
   * Log token lifecycle event for monitoring
   * @param event - Description of the token event
   * @param details - Additional details for the log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static logTokenEvent(event: string, details?: Record<string, any>): void {
    console.log(`[TokenManager] ${event}`, details || "");
  }
}
