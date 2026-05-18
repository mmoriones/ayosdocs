import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            fullName: user.name,
            email: user.email,
            picture: user.image,
            googleAuth: true,
            isVerified: true,
          });
          user.isNewUser = true;
        } else {
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
        session.user.onboarded = dbUser.onboarded;
        session.user.role = dbUser.role;
        session.user.isNewUser = token.isNewUser;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
