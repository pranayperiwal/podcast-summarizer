const { Configuration, OpenAIApi } = require("openai");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const sqsclient = new SQSClient({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SQS_SECRET_KEY_ID,
  },
});

const SQS_QUEUE_URL = "assembly-ai-hook";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  // IP Filtering
  const allowedIPs = ["127.0.0.1", "44.238.19.20"];

  // Get the client IP address from the request headers
  const clientIP =
    req.headers["x-forwarded-for"].split(",")[0] || req.socket.remoteAddress;
  console.log(`Got Request From ${clientIP}`);

  // Check if the client IP is in the allowed IP list
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({ message: "Access denied" }); // Return a 403 error
  }

  const { status, transcript_id } = req.body;
  const hashValue = req.query.params;

  console.log(`Got transcript for ${hashValue}`);

  try {
    if (await checkRequestStatus(hashValue, "In Progress")) {
      //offload the processing to aws lambda
      //send details to SQS
      //details to be send:
      // 1. transcript_id
      // 2. hashValue

      const messageBody = { transcript_id, hashValue };

      const command = new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody),
      });

      //after that respond to the request with success or failure status
      await sqsclient
        .send(command)
        .then((sqsRes) => {
          console.log("Success response from sqs: ", sqsRes);
          return res.status(200).send("Success");
        })
        .catch(async (err) => {
          console.error("Error response from sqs: ", err);

          await updateRequestDbStatus(hashValue, "Error");
          return res.status(404).send("error in processing");
        });
    } else {
      return res.status(200).json({ message: "Request Complete" });
    }
  } catch (err) {
    await updateRequestDbStatus(hashValue, "Error");
    console.error(err);
    return res.status(404).send(err.message);
  }
}

async function updateRequestDbStatus(podcastHash, newStatus) {
  if (newStatus === "Completed") {
    const requestUpdate = await prisma.request.updateMany({
      where: {
        podcast_hash: podcastHash,
      },
      data: {
        status: newStatus,
      },
    });

    const podcastUpdate = await prisma.podcast.update({
      where: {
        hash: podcastHash,
      },
      data: {
        summary_complete: true,
      },
    });

    return { requestUpdate, podcastUpdate };
  }
  return await prisma.request.updateMany({
    where: {
      podcast_hash: podcastHash,
    },
    data: {
      status: newStatus,
    },
  });
}

async function checkRequestStatus(podcastHash, checkStatus) {
  const currentStatus = await prisma.request.findFirst({
    where: {
      podcast_hash: podcastHash,
    },
    select: {
      status: true,
    },
  });

  console.log("Current request status:");
  console.log(currentStatus);

  if (currentStatus["status"] == checkStatus) {
    console.log(`Request is ${checkStatus}`);
    return true;
  } else {
    console.log(`Request is not ${checkStatus}`);
    return false;
  }
}
