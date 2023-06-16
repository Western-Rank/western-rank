const Brevo = require("@getbrevo/brevo");
const { exec } = require("child_process");
const defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
defaultClient.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

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
  return apiInstance.sendTransacEmail({
    to: [{ email: to, name: "Western Rank" }],
    sender: { name: "Western Rank", email: from },
    subject: subject,
    htmlContent: html,
    textContent: text,
  });
}
