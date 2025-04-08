import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto'

import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found or password not set");
        }

        // Replace the bcrypt.compare in the authorize function with:
        const isValid = crypto
          .createHash('sha256')
          .update(credentials.password + 'some-salt-value')
          .digest('hex') === user.password;
        
        if (!isValid) {
          throw new Error("Invalid password");
        }
        
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        // Add the user ID to the session from the token
        session.user.id = token.id as string;
        
        // Add user role to the session from the token
        session.user.role = token.role as any;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        // Get user type from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { type: true }
        });
        token.role = dbUser?.type || 'user';
      }
      return token;
    }
  },
  pages: {
    signIn: '/', // We're handling the sign-in in a modal
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET",
  debug: process.env.NODE_ENV === "development",
};