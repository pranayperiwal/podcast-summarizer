import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";

const createSendEmailCommand = (
  requesterUUID,
  //   requesterEmail,
  fromAddress,
  podcastName,
  showName
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: ["pranayperiwal24@gmail.com", "yash20008@gmail.com"],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data:
            "Incoming request from uuid: " +
            requesterUUID +
            ". Podcast name: " +
            podcastName +
            ". Show name: " +
            showName,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Podcast Request Alert!",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const incomingRequestEmailNotification = async (
  requesterUUID,
  //   requesterEmail,
  podcastName,
  showName
) => {
  const sendEmailCommand = createSendEmailCommand(
    requesterUUID,
    // requesterEmail,
    "podcrunch.ai@gmail.com",
    podcastName,
    showName
  );

  console.log(requesterUUID, podcastName, showName);

  try {
    const res = await sesClient.send(sendEmailCommand);
    return res;
  } catch (e) {
    console.error("Failed to send email.");
    console.log(e.message);
    return e;
  }
};
