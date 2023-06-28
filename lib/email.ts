import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend("re_D8STfyPM_KrNeeYJgC1H4PSTJBnZJFCNL");

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
