export const nameTitles = ["Dr.", "Mr.", "Mrs.", "Miss"];

export const languages = [
  {
    name: "English",
    type: "en",
  },
  {
    name: "German (Deutsch)",
    type: "de",
  },
];

export const platforms = ["Adyen", "Shopify", "Rxscale"];
export const brandPartners = ["NordLeaf", "Prio One", "SoLean"];

/**
 * Authentication Configuration Constants
 * Centralized configuration for auth system behavior
 */

/**
 * Token expiration times (in seconds)
 */
export const TOKEN_EXPIRY = {
  // Session token (access token) validity
  SESSION: 900, // 15 minutes
  // Refresh token validity
  REFRESH: 7 * 24 * 60 * 60, // 7 days
  // How long before expiry to consider token as "expiring soon"
  EXPIRING_SOON_THRESHOLD: 5 * 60, // 5 minutes
};

/**
 * Cookie configuration
 */
export const COOKIE_CONFIG = {
  // HTTP-only prevents JavaScript access
  httpOnly: true,
  // Strict SameSite prevents CSRF
  sameSite: "strict" as const,
  // Secure only in production
  secure: process.env.NODE_ENV === "production",
  // Cookie paths for scoping
  path: "/",
};

/**
 * Auth endpoints
 */
export const AUTH_ENDPOINTS = {
  // Backend endpoints
  BACKEND_REFRESH: "/auth/refresh-token/",
  BACKEND_LOGOUT: "/auth/logout/",

  // Frontend API endpoints
  API_REFRESH: "/api/auth/refresh",
  API_LOGOUT: "/api/auth/logout",

  // Frontend routes
  SIGN_IN: "/sign-in",
  SIGN_OUT: "/sign-out",
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
};

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = {
  // Admin routes require admin role
  admin: /^\/admin/,
  // Dashboard routes require authentication
  dashboard: /^\/dashboard/,
  // Other protected routes
  protected: [/^\/api\/.*(?<!auth)/], // All API routes except auth
};

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = ["/sign-in", "/reset-password", "/"];

/**
 * Request retry configuration
 */
export const RETRY_CONFIG = {
  // Maximum number of retry attempts
  maxAttempts: 3,
  // Initial delay before first retry (ms)
  initialDelayMs: 100,
  // Maximum delay between retries (ms)
  maxDelayMs: 5000,
  // Exponential backoff multiplier
  backoffMultiplier: 2,
  // Request timeout (ms)
  requestTimeout: 10000,
};

/**
 * Token refresh configuration
 */
export const REFRESH_CONFIG = {
  // Timeout for refresh endpoint (ms)
  refreshTimeout: 10000,
  // Timeout for backend notify (fire-and-forget) (ms)
  notifyTimeout: 5000,
  // Enable refresh token rotation (request new refresh token)
  enableRotation: true,
  // Enable automatic refresh sliding (refresh token when approaching expiry)
  enableSliding: true,
};

/**
 * Error messages
 */
export const AUTH_ERROR_MESSAGES = {
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  TOKEN_REFRESH_FAILED: "Failed to refresh your session. Please sign in again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  SESSION_NOT_FOUND: "Session not found. Please sign in again.",
};

/**
 * Logging configuration
 */
export const LOGGING_CONFIG = {
  // Enable auth event logging
  enableTokenLogging: process.env.NODE_ENV === "development",
  // Include token snippets in logs (last 8 chars)
  includeTokenSnippets: false,
  // Log all requests (verbose)
  logAllRequests: process.env.NODE_ENV === "development",
};

/**
 * Feature flags for auth system
 */
export const AUTH_FEATURES = {
  // Enable concurrent request queuing during refresh
  enableQueueing: true,
  // Enable automatic retry on network failures
  enableAutoRetry: true,
  // Enable token expiry sliding on each successful request
  enableTokenSliding: true,
  // Enable backend notification on logout (optional)
  notifyBackendOnLogout: true,
};
