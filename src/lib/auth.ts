import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          console.log("LOGIN START");

          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("EMAIL:", credentials.email);

          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          console.log("DB USER:", user);

          if (!user) {
            console.log("User not found");
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("PASSWORD MATCH:", isPasswordCorrect);

          if (!isPasswordCorrect) {
            console.log("Wrong password");
            return null;
          }

          console.log("LOGIN SUCCESS");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.log("AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const getSession = () => getServerSession(authOptions);
