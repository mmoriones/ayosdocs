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
      allowDangerousEmailAccountLinking: true,
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

        if (credentials.email.length > 100 || credentials.password.length > 128) {
          throw new Error("Invalid credentials");
        }

        // 1. IP Rate Limiting (Tightened to 5)
        const ipLimit = await rateLimit('login', 5);
        if (!ipLimit.success) {
          const resetTime = ipLimit.resetTime ? new Date(ipLimit.resetTime) : new Date(Date.now() + 60000);
          const remainingMs = resetTime.getTime() - Date.now();
          const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
          throw new Error(`Too many login attempts. Please try again in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`);
        }


        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        let restoredAccount = false;

        // 2. Account Lockout Check
        if (user.lockUntil && user.lockUntil > Date.now()) {
          const remainingMs = user.lockUntil - Date.now();
          const remainingSeconds = Math.ceil(remainingMs / 1000);
          
          if (remainingSeconds < 120) {
            throw new Error(`Account temporarily locked. Try again in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`);
          }
          
          const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
          throw new Error(`Account temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`);
        }

        // 3. Soft-Delete Check — restore within 30 days, reject after
        if (user.deletedAt) {
          const daysSinceDeletion = (Date.now() - user.deletedAt.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceDeletion >= 30) {
            throw new Error("AccountPermanentlyDeleted");
          }
          // Within grace period — restore account
          user.deletedAt = undefined;
          user.loginAttempts = 0;
          user.lockUntil = undefined;
          await user.save();
          restoredAccount = true;
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
            // Fixed 15-minute lockout
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
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
          restoredAccount,
        };
      }
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
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

        if (existingUser?.deletedAt) {
          const daysSinceDeletion = (Date.now() - existingUser.deletedAt.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceDeletion >= 30) {
            // Permanently deleted — delete old doc, create new one
            await User.deleteOne({ _id: existingUser._id });
            await User.create({
              fullName: user.name,
              email: user.email,
              picture: user.image,
              googleAuth: true,
              isVerified: true,
            });
            user.isNewUser = true;
            return true;
          } else {
            // Within grace period — restore account
            existingUser.deletedAt = undefined;
            existingUser.loginAttempts = 0;
            existingUser.lockUntil = undefined;
            await existingUser.save();
            user.restoredAccount = true;
          }
        }
        
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
        if (user.restoredAccount) {
          token.restoredAccount = true;
        }
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
        session.user.isVerified = dbUser.isVerified;
        session.user.isNewUser = token.isNewUser;
        session.user.hasPassword = !!dbUser.password;
        session.user.googleAuth = dbUser.googleAuth;
        session.user.restoredAccount = token.restoredAccount || false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
