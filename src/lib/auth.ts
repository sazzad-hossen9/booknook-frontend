import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI || "");
const db = client.db("booknook");

// Dynamically determine canonical baseURL based on environment
const resolveBaseURL = () => {
  // In production (Vercel deployment or production build), NEVER use localhost!
  if (process.env.NODE_ENV === "production") {
    if (
      process.env.BETTER_AUTH_URL &&
      !process.env.BETTER_AUTH_URL.includes("localhost")
    ) {
      return process.env.BETTER_AUTH_URL;
    }
    if (
      process.env.NEXT_PUBLIC_APP_URL &&
      !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
    ) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return "https://booknook-pearl.vercel.app";
  }

  // Local development
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: resolveBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://booknook-sazzad-hossen.vercel.app",
    "https://booknook-pearl.vercel.app",
    "https://*.vercel.app",
  ],
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(
        `[BookNook Auth] Password reset requested for ${user.email}: ${url}`,
      );
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      ),
    },
  },
  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
      },
    },
  },
});
