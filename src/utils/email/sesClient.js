import { SESClient } from "@aws-sdk/client-ses";
const REGION = "ap-southeast-1";

// const sesClient = new AWS.SESClient({ region: REGION });

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export { sesClient };
