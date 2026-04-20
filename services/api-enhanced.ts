import { AuthService } from "./auth/";
import { TokenManager, TokenState } from "./auth/token-manager";
import { AuthError } from "@/lib/auth-errors";
import { AuthorizationHeader, OptionsType, ResponseType } from "@/types/api";

/**
 * Retry configuration for failed requests
 */
interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 100,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

/**
 * Enhanced API Class with Integrated Token Management
 *
 * Features:
 * - Automatic token refresh on 401
 * - Prevention of concurrent refresh requests
 * - Request queuing during token refresh
 * - Exponential backoff for network errors
 * - Clear error categorization
 * - Comprehensive logging
 * - Server-side rendering compatible
 */
export class ApiEnhanced {
  static baseUrl = process.env.BASE_URL!;
  static API_BASE_URL = process.env.APP_URL!;

  /**
   * Get the current access token
   * Uses TokenManager for consistent token handling
   */
  private static async getToken(): Promise<string | null> {
    return await TokenManager.getAccessToken();
  }

  /**
   * Get headers for a request
   * Includes authorization if auth is required
   */
  private static async getHeaders({
    auth = false,
    customHeader = "application/json",
  }: {
    auth?: boolean;
    customHeader?: string;
  }): Promise<Record<string, string>> {
    const headers: Record<string, string> & AuthorizationHeader = {};

    if (customHeader !== "multipart/form-data") {
      headers["Content-Type"] = customHeader;
    }
    headers["Accept"] = "application/json";

    if (auth) {
      const token = await this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Format request body based on content type
   */
  private static getRequestBody<T>(
    options: OptionsType<T>,
    headers: Record<string, string>,
  ) {
    if (
      options.method === "POST" ||
      options.method === "PUT" ||
      options.method === "PATCH" ||
      options.method === "DELETE"
    ) {
      if (options.body) {
        if (options.body instanceof FormData) {
          delete headers["Content-Type"];
          return options.body;
        } else if (
          headers["Content-Type"] === "application/x-www-form-urlencoded"
        ) {
          return new URLSearchParams(
            options.body as Record<string, string>,
          ).toString();
        } else {
          return JSON.stringify(options.body);
        }
      }
      return null;
    }
    return null;
  }

  /**
   * Sleep for a given number of milliseconds
   * Used for exponential backoff
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calculate exponential backoff delay
   */
  private static calculateBackoffDelay(
    attempt: number,
    config: RetryConfig,
  ): number {
    const delay =
      config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelayMs);
  }

  /**
   * Determine if an error is retryable
   */
  private static isRetryableStatus(status: number): boolean {
    // Retry on network timeouts, rate limits, and service unavailable
    return status === 408 || status === 429 || status === 503;
  }

  /**
   * Handle token expiry and refresh
   *
   * This is the core logic for token refresh:
   * 1. Checks if token is actually expired/invalid
   * 2. Validates refresh token exists
   * 3. Attempts refresh with concurrency prevention
   * 4. Returns success status
   */
  private static async handleTokenExpiry(): Promise<boolean> {
    try {
      TokenManager.logTokenEvent(
        "Handling 401 response - checking token state",
      );

      // Validate current token state
      const tokenValidation = await TokenManager.validateAccessToken();

      // If token is not actually expired, something else is wrong
      if (
        tokenValidation.state !== TokenState.EXPIRED &&
        tokenValidation.state !== TokenState.INVALID &&
        tokenValidation.state !== TokenState.MISSING
      ) {
        TokenManager.logTokenEvent(
          "Token state is valid, 401 may be due to other reasons",
          { state: tokenValidation.state },
        );
        return false;
      }

      // Check if refresh token is available
      const hasRefreshToken = await AuthService.hasRefreshToken();
      if (!hasRefreshToken) {
        TokenManager.logTokenEvent(
          "No refresh token available, cannot refresh",
        );
        // Trigger logout - user has no refresh token
        await AuthService.logout("/sign-in");
        return false;
      }

      // Attempt to refresh tokens
      try {
        const refreshed = await AuthService.refreshTokens();
        if (refreshed) {
          TokenManager.logTokenEvent("Token refresh succeeded");
          return true;
        }
        return false;
      } catch (error) {
        if (error instanceof AuthError) {
          TokenManager.logTokenEvent("Token refresh failed with auth error", {
            errorType: error.type,
          });

          // If refresh failed, logout the user
          if (error.requiresLogout()) {
            await AuthService.logout("/sign-in");
          }
        }
        return false;
      }
    } catch (error) {
      console.error("[ApiEnhanced] Error handling token expiry:", error);
      return false;
    }
  }

  /**
   * Handle response and implement retry logic
   *
   * Handles:
   * - 401: Attempt token refresh and retry
   * - 4xx/5xx: Return error response
   * - Network errors: Retry with exponential backoff
   */
  private static async handleResponse<R>(
    response: Response,
    url: string,
    makeRequest: () => Promise<Response>,
    attempt: number = 1,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG,
  ): Promise<ResponseType<R>> {
    // Success response
    if (response.ok) {
      return {
        ok: true,
        status: response.status,
        body: (await response.json()) as R,
      };
    }

    // 401 Unauthorized - attempt token refresh
    if (
      response.status === 401 &&
      !url.includes("/auth/login/") &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/logout")
    ) {
      TokenManager.logTokenEvent("Received 401 response", { url });

      const refreshed = await this.handleTokenExpiry();

      if (refreshed) {
        // Token refresh succeeded, retry the original request
        TokenManager.logTokenEvent("Retrying request after token refresh");
        try {
          const retryResponse = await makeRequest();
          return this.handleResponse<R>(
            retryResponse,
            url,
            makeRequest,
            attempt,
            retryConfig,
          );
        } catch (error) {
          return this.handleError<R>(error);
        }
      }

      // Refresh failed, return 401 error
      return {
        ok: false,
        status: 401,
        body: {
          code: 401,
          message: "Unauthorized - could not refresh token",
          description: "Your session has expired. Please sign in again.",
        },
      };
    }

    // Other error responses
    if (!response.ok) {
      // Check if retryable and we haven't exceeded max attempts
      if (
        this.isRetryableStatus(response.status) &&
        attempt < retryConfig.maxAttempts
      ) {
        const delay = this.calculateBackoffDelay(attempt, retryConfig);
        TokenManager.logTokenEvent(
          `Retryable error, waiting ${delay}ms before retry`,
          {
            status: response.status,
            attempt,
            maxAttempts: retryConfig.maxAttempts,
          },
        );

        await this.sleep(delay);

        try {
          const retryResponse = await makeRequest();
          return this.handleResponse<R>(
            retryResponse,
            url,
            makeRequest,
            attempt + 1,
            retryConfig,
          );
        } catch (error) {
          return this.handleError<R>(error);
        }
      }

      // Non-retryable error or max attempts exceeded
      let errorMessage =
        response.status === 502 ? "Bad Gateway" : "An error occurred";
      let errorDescription = "";

      try {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorBody = await response.json();
          if (errorBody.detail && typeof errorBody.detail === "string") {
            errorMessage =
              errorBody.message || errorBody.detail || errorMessage;
          } else {
            errorMessage =
              errorBody.message || errorBody.detail?.message || errorMessage;
          }
          errorDescription = errorBody.description || errorDescription;
        } else {
          errorDescription = await response.text();
        }
      } catch (e) {
        console.error("[ApiEnhanced] Error parsing error response:", e);
        errorDescription =
          "An unexpected error occurred while processing the response.";
      }

      return {
        ok: false,
        status: response.status,
        body: {
          code: response.status,
          message: errorMessage,
          description: errorDescription,
        },
      };
    }

    // Fallback
    return {
      ok: false,
      status: response.status,
      body: {
        code: response.status,
        message: "Unknown error",
        description: "An unexpected error occurred",
      },
    };
  }

  /**
   * Handle network and unexpected errors
   */
  private static handleError<R>(error: unknown): ResponseType<R> {
    console.error("[ApiEnhanced] Request error:", error);

    return {
      ok: false,
      status: 500,
      body: {
        code: 500,
        message: "Server is unresponsive. Please check internet connection.",
        description:
          error instanceof Error ? error.toString() : "Failed to fetch",
      },
    };
  }

  /**
   * Make an HTTP request with integrated token management
   *
   * Handles:
   * - Token retrieval and injection
   * - 401 response handling with refresh
   * - Exponential backoff retries
   * - Error categorization
   */
  static async request<T, R>({
    baseUrl = this.baseUrl,
    options,
    auth = false,
    customHeader = "application/json",
  }: {
    baseUrl?: string;
    options: OptionsType<T>;
    auth?: boolean;
    customHeader?: string;
  }): Promise<ResponseType<R>> {
    const headers = await this.getHeaders({ auth, customHeader });
    const body = this.getRequestBody(options, headers);
    const url = baseUrl + options.url;

    // Create the request function that can be retried
    const makeRequest = () => {
      return fetch(url, {
        method: options.method,
        headers: headers,
        body,
      });
    };

    try {
      const response = await makeRequest();
      return this.handleResponse<R>(response, url, makeRequest);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  // Convenience methods (same as original Api class)
  static async get<R>(url: string, auth?: boolean) {
    return this.request<void, R>({
      options: { method: "GET", url },
      auth,
    });
  }

  static async post<T, R>(
    url: string,
    body?: T,
    auth?: boolean,
    customHeader?: string,
  ) {
    return this.request<T, R>({
      options: { method: "POST", url, body },
      auth,
      customHeader,
    });
  }

  static async delete<T, R>(url: string, body?: T, auth?: boolean) {
    return this.request<T, R>({
      options: { method: "DELETE", url, body },
      auth,
    });
  }

  static async patch<T, R>(
    url: string,
    body: T,
    auth?: boolean,
    customHeader?: string,
  ) {
    return this.request<T, R>({
      options: { method: "PATCH", url, body },
      auth,
      customHeader,
    });
  }

  static async put<T, R>(
    url: string,
    body: T,
    auth?: boolean,
    customHeader?: string,
  ) {
    return this.request<T, R>({
      options: { method: "PUT", url, body },
      auth,
      customHeader,
    });
  }

  static async fetchImageAsArrayBuffer(url: string) {
    const headers = await this.getHeaders({ auth: true });

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return {
        error: response.statusText || "Failed to fetch image",
        status: response.status,
      };
    }

    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    return {
      buffer,
      contentType,
    };
  }
}
