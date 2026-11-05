import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Server-side helper to retrieve JWT token from Better Auth session.
 * Used only in Server Components, Route Handlers, and Server Actions.
 * Never import into Client Components.
 */
export const getTokenFromServer = async (): Promise<string | null> => {
  try {
    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    });

    return jwtToken?.token ?? null;
  } catch {
    return null;
  }
};
