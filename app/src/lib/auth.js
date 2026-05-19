import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { rateLimit } from "./rate-limit";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // 1. IP Rate Limiting
        const ipLimit = await rateLimit('login', 10);
        if (!ipLimit.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // 2. Account Lockout Check
        if (user.lockUntil && user.lockUntil > Date.now()) {
          const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
          throw new Error(`Account temporarily locked. Try again in ${remainingMinutes} minutes.`);
        }

        if (!user.password && user.googleAuth) {
          throw new Error("GoogleAccountOnly");
        }

        if (!user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await user.comparePassword(credentials.password);

        if (!isPasswordCorrect) {
          // Increment login attempts
          user.loginAttempts += 1;
          if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
          }
          await user.save();
          throw new Error("Invalid credentials");
        }

        // Success - Reset attempts
        if (user.loginAttempts > 0 || user.lockUntil) {
          user.loginAttempts = 0;
          user.lockUntil = undefined;
          await user.save();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          image: user.picture,
        };
      }
    }),
  ],
  // Support multiple subdomains and proxies
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // Lax is usually better for OAuth flows to avoid initial redirect issues
        path: '/',
        domain: process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : '.ayosdocs.com',
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
    callbackUrl: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        path: '/',
        domain: process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : '.ayosdocs.com',
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
    csrfToken: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        domain: process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : '.ayosdocs.com',
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
    pkceCodeVerifier: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : '.ayosdocs.com',
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
    state: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? '__Secure-' : ''}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : '.ayosdocs.com',
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // New user registration via Google
          await User.create({
            fullName: user.name,
            email: user.email,
            picture: user.image,
            googleAuth: true,
            isVerified: true,
          });
          user.isNewUser = true;
        } else {
          // Existing user (either Google or Email/Password)
          // If they haven't used Google before, "merge/link" it now
          if (!existingUser.googleAuth) {
            existingUser.googleAuth = true;
            // Refresh name and picture from Google to keep profile up to date
            if (user.name) existingUser.fullName = user.name;
            if (user.image) existingUser.picture = user.image;
            await existingUser.save();
          }
          user.isNewUser = false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isNewUser = user.isNewUser;
      }
      return token;
    },
    async session({ session, token }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.name = dbUser.fullName;
        session.user.image = dbUser.picture;
        session.user.onboarded = dbUser.onboarded;
        session.user.role = dbUser.role;
        session.user.isNewUser = token.isNewUser;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
