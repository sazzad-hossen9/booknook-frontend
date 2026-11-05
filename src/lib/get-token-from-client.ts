import { authClient } from "./auth-client";

/**
 * Client-safe helper to retrieve JWT token from Better Auth browser client.
 * Safe to import and execute in React Client Components.
 * Never imports MongoDB, next/headers, or server-only auth files.
 */
export const getTokenFromClient = async (): Promise<string | null> => {
  try {
    const { data, error } = await authClient.token();

    if (error) {
      return null;
    }

    const token = data?.token;

    return token ?? null;
  } catch {
    return null;
  }
};
