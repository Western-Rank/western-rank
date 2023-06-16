import { Resend } from "resend";

const resend = new Resend("re_D8STfyPM_KrNeeYJgC1H4PSTJBnZJFCNL");

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: to,
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });
}
