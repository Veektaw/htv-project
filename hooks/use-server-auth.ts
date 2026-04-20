import "server-only";

import {
  getUserSessionAction,
  getAccessTokenAction,
  isAuthenticatedAction,
  logoutAction,
  validateSessionAction,
} from "@/services/actions/auth";
import { UserSessionData } from "@/types/auth";

/**
 * Server-side Authentication Hook
 *
 * Provides safe, read-only access to authentication data in server components.
 * All cookie operations are delegated to Server Actions which can safely write cookies.
 *
 * IMPORTANT LIMITATIONS:
 * - This hook can ONLY be used in Server Components
 * - It can ONLY READ auth data (cookies can only be read in Server Components)
 * - For cookie writes (logout, etc.), use the Server Actions in app/actions/auth.ts
 *
 * Example usage:
 * ```tsx
 * import { useServerAuth } from "@/hooks/use-server-auth";
 *
 * export default async function Dashboard() {
 *   const auth = useServerAuth();
 *   const user = await auth.getUser();
 *
 *   if (!user) {
 *     redirect('/sign-in');
 *   }
 *
 *   return <div>Welcome, {user.email}</div>;
 * }
 * ```
 *
 * For logout:
 * ```tsx
 * import { logoutAction } from "@/app/actions/auth";
 *
 * export default async function Dashboard() {
 *   return (
 *     <form action={logoutAction}>
 *       <button type="submit">Logout</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useServerAuth() {
  return {
    /**
     * Get the current user session (READ ONLY)
     * Uses Server Action for safe access from server components
     *
     * @returns UserSession | null
     */
    getSession: getUserSessionAction,

    /**
     * Get the current user data (READ ONLY)
     * Wrapper that extracts user data from session
     *
     * @returns UserSessionData | null
     */
    getUser: async (): Promise<UserSessionData | null> => {
      const session = await getUserSessionAction();
      return session?.data.user ?? null;
    },

    /**
     * Get the current access token (READ ONLY)
     * Uses Server Action for safe access
     *
     * @returns Access token string or null
     */
    getAccessToken: getAccessTokenAction,

    /**
     * Check if user is authenticated (READ ONLY)
     * Uses Server Action for safe access
     *
     * @returns true if user has a valid session and refresh token
     */
    isAuthenticated: isAuthenticatedAction,

    /**
     * Get user role (READ ONLY)
     * Convenience method for role-based access control
     *
     * @returns User role or null
     */
    getRole: async (): Promise<string | null> => {
      const user = await getUserSessionAction();
      return user?.data.user?.role ?? null;
    },

    /**
     * Check if user has a specific role (READ ONLY)
     * Useful for protecting server components by role
     *
     * @param role - The role to check for
     * @returns true if user has the specified role
     */
    hasRole: async (role: string): Promise<boolean> => {
      const user = await getUserSessionAction();
      return user?.data.user?.role === role;
    },

    /**
     * Get user ID (READ ONLY)
     * @returns User ID or null
     */
    getUserId: async (): Promise<string | null> => {
      const user = await getUserSessionAction();
      return user?.data.user?.id ?? null;
    },

    /**
     * Check if user needs to change password (READ ONLY)
     * Useful for redirecting to password change page
     *
     * @returns true if user must change password
     */
    mustChangePassword: async (): Promise<boolean> => {
      const user = await getUserSessionAction();
      return user?.data.user?.must_change_password ?? false;
    },

    /**
     * Validate the current session (READ ONLY)
     * Returns detailed validation information
     *
     * @returns Validation result object
     */
    validateSession: validateSessionAction,

    /**
     * Logout the user (COOKIE WRITE)
     *
     * This is a Server Action that can be called from server components.
     * It handles cookie deletion and optional backend notification.
     *
     * Usage:
     * ```tsx
     * import { logoutAction } from "@/app/actions/auth";
     *
     * // In a form:
     * <form action={logoutAction}>
     *   <button type="submit">Logout</button>
     * </form>
     *
     * // Or directly:
     * await logoutAction('/sign-in');
     * ```
     *
     * @param redirectPath - Path to redirect to after logout (default: "/sign-in")
     * @throws Never returns - always redirects
     */
    logout: logoutAction,
  };
}

/**
 * Type for the return value of useServerAuth hook
 * Useful for type-safe usage in server components
 */
export type ServerAuthHook = ReturnType<typeof useServerAuth>;
