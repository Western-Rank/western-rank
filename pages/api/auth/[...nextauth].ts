import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { MagicLinkEmail } from "@/emails/email";
import { isUwoEmail } from "@/lib/utils";
import { SendVerificationRequestParams } from "next-auth/providers";
import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND);

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  react,
}: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  react?: ReactElement<any, string | JSXElementConstructor<any>>;
}) {
  return resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    html: html,
    text: text,
    react: react,
  });
}

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  console.log(url);
  if (process.env.NODE_ENV == "development") console.log(url);

  if (!isUwoEmail(identifier)) {
    throw new Error("Please enter a valid UWO email address");
  }

  try {
    sendEmail({
      to: identifier,
      from: provider.from || "westernrank@gmail.com",
      subject: `Sign in to ${host}`,
      text: text({ url, host }),
      react: MagicLinkEmail({ magicLinkUrl: url, emailAddress: identifier }),
    });
  } catch (e) {
    throw new Error("Email could not be sent: " + e);
  }
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT ?? ""),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
