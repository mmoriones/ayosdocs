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
        }
      }
      return true;
    },
    async session({ session, token }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.onboarded = dbUser.onboarded;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
