// import { SendEmailCommand } from "@aws-sdk/client-ses";
// import { sesClient } from "./sesClient";

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createSendEmailMsg = (
  toAddress,
  fromAddress,
  podcastName,
  showName,
  summaryURL
) => {
  return {
    to: toAddress,
    from: {
      email: fromAddress,
      name: "PodCrunch Summary",
    },
    subject: "Podcast summary was successful!",
    templateId: "d-f138b2b1578e45d996422dd15e6754e5",
    dynamic_template_data: {
      podcastName,
      showName,
      summaryURL,
    },
  };
};

export const sendConfirmationEmail = async (
  receiverEmail,
  podcastName,
  showName,
  summaryURL
) => {
  const msg = createSendEmailMsg(
    receiverEmail,
    "summary@podcrunch.co",
    podcastName,
    showName,
    summaryURL
  );

  console.log(
    "Summary complete email sent: ",
    receiverEmail,
    podcastName,
    showName,
    summaryURL
  );

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
