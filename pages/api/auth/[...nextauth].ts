import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/db";

// EMAIL_SERVER_USER=maazali22@gmail.com
// EMAIL_SERVER_PASSWORD=Monster32!2
// EMAIL_SERVER_HOST=smtp.gmail.com
// EMAIL_SERVER_PORT=587
// EMAIL_FROM=maazali22@gmail.com

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // server: {
      //   host: process.env.EMAIL_SERVER_HOST,
      //   port: process.env.EMAIL_SERVER_PORT,
      //   auth: {
      //     user: process.env.EMAIL_SERVER_USER,
      //     pass: process.env.EMAIL_SERVER_PASSWORD,
      //   },
      // },
      server: {
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: "westernrank@gmail.com",
          pass: "Pfqv91Lg0WYXJzhK",
        },
      },
      from: "westernrank@gmail.com",
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    // }),
  ],
};

export default NextAuth(authOptions);
