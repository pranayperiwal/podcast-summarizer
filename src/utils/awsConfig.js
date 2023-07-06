import AWS, { config } from "aws-sdk";

config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1", // Replace with your desired region
});

export default AWS;
