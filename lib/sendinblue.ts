const Brevo = require("@getbrevo/brevo");
const defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
defaultClient.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

//   curl --request POST \
//   --url https://api.brevo.com/v3/smtp/email \
//   --header 'accept: application/json' \
//   --header 'api-key:YOUR_API_KEY' \
//   --header 'content-type: application/json' \
//   --data '{
//    "sender":{
//       "name":"Sender Alex",
//       "email":"senderalex@example.com"
//    },
//    "to":[
//       {
//          "email":"testmail@example.com",
//          "name":"John Doe"
//       }
//    ],
//    "subject":"Hello world",
//    "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
// }'

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
  const sendSmtpEmail = new Brevo.SendSmtpEmail({
    to: [{ email: to }],
    sender: { email: from },
    subject: subject,
    textContent: text,
    htmlContent: html,
  });
  return apiInstance.sendTransacEmail(sendSmtpEmail);

  // return fetch("https://api.brevo.com/v3/smtp/email", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "api-key": process.env.SENDINBLUE_API_KEY || "",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     sender: {
  //       name: "Western Rank",
  //       email: from,
  //     },
  //     to: [
  //       {
  //         email: to,
  //       },
  //     ],
  //     subject: subject,
  //     htmlContent: html,
  //     textContent: text,
  //   }),
  // });
}
