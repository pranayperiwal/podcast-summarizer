const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({ 
    region: "ap-southeast-1",
    credentials:{
     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_S3_SECRET_KEY_ID
    }
});

export default { client };