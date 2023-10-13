import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";

const createSendEmailCommand = (receiverEmails, fromAddress, podcastHash) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: receiverEmails,
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "Failure of podcast with podcast hash: " + podcastHash,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Podcast Summary Error Alert!",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const podcastErrorEmailNotification = async (podcastHash) => {
  let receiverEmails = [, "pranayperiwal24@gmail.com", "yash20008@gmail.com"];

  console.log("Podcast error email sent to: " + receiverEmails);
  const sendEmailCommand = createSendEmailCommand(
    receiverEmails,
    // requesterEmail,
    "podcrunch.ai@gmail.com",
    podcastHash
  );

  try {
    const res = await sesClient.send(sendEmailCommand);
    return res;
  } catch (e) {
    console.error("Failed to send email.");
    console.log(e.message);
    return e;
  }
};
