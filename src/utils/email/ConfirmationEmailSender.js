import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  podcastName,
  showName,
  summaryURL
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data:
            "The summary of " +
            podcastName +
            " from " +
            showName +
            " is done! You can find it at this link: " +
            summaryURL,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Podcast summary was successful!",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const sendConfirmationEmail = async (
  receiverEmail,
  podcastName,
  showName,
  summaryURL
) => {
  const sendEmailCommand = createSendEmailCommand(
    receiverEmail,
    "podcrunch.ai@gmail.com",
    podcastName,
    showName,
    summaryURL
  );

  console.log(receiverEmail, podcastName, showName, summaryURL);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.error("Failed to send email.");
    console.log(e.message);
    return e;
  }
};
