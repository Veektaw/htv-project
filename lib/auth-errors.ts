/**
 * Authentication Error Categories
 * Distinguishes between different types of auth failures for proper handling
 */

export enum AuthErrorType {
  // Token-related errors
  EXPIRED_ACCESS_TOKEN = "EXPIRED_ACCESS_TOKEN",
  INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
  MISSING_ACCESS_TOKEN = "MISSING_ACCESS_TOKEN",

  // Refresh token errors
  EXPIRED_REFRESH_TOKEN = "EXPIRED_REFRESH_TOKEN",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  MISSING_REFRESH_TOKEN = "MISSING_REFRESH_TOKEN",

  // Refresh process errors
  REFRESH_FAILED = "REFRESH_FAILED",
  REFRESH_NETWORK_ERROR = "REFRESH_NETWORK_ERROR",
  REFRESH_INVALID_RESPONSE = "REFRESH_INVALID_RESPONSE",

  // General errors
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Auth error class for structured error handling
 */
export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    message: string,
    public statusCode: number = 401,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "AuthError";
  }

  /**
   * Check if this error is retryable
   */
  isRetryable(): boolean {
    const retryableErrors = [
      AuthErrorType.EXPIRED_ACCESS_TOKEN,
      AuthErrorType.REFRESH_NETWORK_ERROR,
    ];
    return retryableErrors.includes(this.type);
  }

  /**
   * Check if this error requires logout
   */
  requiresLogout(): boolean {
    const logoutErrors = [
      AuthErrorType.INVALID_ACCESS_TOKEN,
      AuthErrorType.MISSING_REFRESH_TOKEN,
      AuthErrorType.INVALID_REFRESH_TOKEN,
      AuthErrorType.EXPIRED_REFRESH_TOKEN,
      AuthErrorType.REFRESH_FAILED,
      AuthErrorType.SESSION_EXPIRED,
      AuthErrorType.UNAUTHORIZED,
    ];
    return logoutErrors.includes(this.type);
  }
}

/**
 * Helper function to create auth errors from HTTP status codes
 */
export function createAuthErrorFromStatus(
  status: number,
  message?: string,
): AuthError {
  switch (status) {
    case 401:
      return new AuthError(
        AuthErrorType.UNAUTHORIZED,
        message || "Unauthorized - token may have expired",
        401,
      );
    case 403:
      return new AuthError(
        AuthErrorType.FORBIDDEN,
        message || "Forbidden - insufficient permissions",
        403,
      );
    case 503:
      return new AuthError(
        AuthErrorType.REFRESH_NETWORK_ERROR,
        message || "Service unavailable - refresh failed",
        503,
      );
    default:
      return new AuthError(
        AuthErrorType.UNKNOWN_ERROR,
        message || "Unknown error",
        status,
      );
  }
}
