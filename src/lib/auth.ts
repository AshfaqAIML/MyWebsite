import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

type GoogleProviderFn = (options: { clientId: string; clientSecret: string }) => Provider;
let GoogleProvider: GoogleProviderFn | null = null;
try {
  const googleModule = await import("next-auth/providers/google");
  GoogleProvider = (googleModule as { default: GoogleProviderFn }).default;
} catch {
  // Google provider not available
}

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = process.env.DASHBOARD_USERNAME || "admin";
      const password = process.env.DASHBOARD_PASSWORD || "admin123";

      if (
        credentials?.email === email &&
        credentials?.password === password
      ) {
        return { id: "1", name: email };
      }
      return null;
    },
  }),
];

const googleProvider =
    GoogleProvider && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? GoogleProvider
      : null;
if (googleProvider) {
  providers.push(
    googleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/dashboard/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const allowedEmail = (process.env.DASHBOARD_USERNAME || "moeedkamraan1123@gmail.com").toLowerCase();
        return !!user.email && user.email.toLowerCase() === allowedEmail;
      }
      return true;
    },
    authorized({ auth: session }) {
      return !!session?.user;
    },
  },
  session: {
    strategy: "jwt",
  },
});
