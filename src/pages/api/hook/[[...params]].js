import AWS from "aws-sdk"
AWS.config.update({ region: 'us-east-1' });

const S3 = new AWS.S3();

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
    try {


        // IP Filtering 
        const allowedIPs = ['127.0.0.1', '44.238.19.20'];

        // Get the client IP address from the request headers
        const clientIP = req.headers['x-forwarded-for'].split(',')[0] || req.socket.remoteAddress;

        console.log(`Got Request From ${clientIP}`);
        // Check if the client IP is in the allowed IP list
        if (!allowedIPs.includes(clientIP)) {
            res.status(403).json({message: 'Access denied'}); // Return a 403 error
            return;
        }


        console.log(req.body);
        const { status, transcript_id } = req.body;
        const hashValue = req.query.params[0];
        
        console.log(transcript_id);
        // Get the transcript 
        const transcriptFile = await getTranscriptFile(transcript_id);
        console.log(transcriptFile);
        res.status(200).json({ name: transcriptFile})
    } catch(err) {
        console.error(err);
        return res.status(404).json({ error: err.message });
    }
}

async function getTranscriptFile(transcriptId) {
    try {
        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`
        
        const headers = {
            "Authorization": process.env.ASSEMBLY_API_KEY,
        };

        while (true) {
            const pollingResponse = await fetch(pollingEndpoint, {
                method: "GET", 
                headers: headers
            });
            const transcriptionResult = await pollingResponse.json();
            if (transcriptionResult.status === 'completed') {
                return transcriptionResult;
            } else if (transcriptionResult.status === 'error') {
                throw new Error(`Transcription failed: ${transcriptionResult.error}`)
            } else {
                await new Promise((resolve) => setTimeout(resolve, 3000))
            }
        }
    } catch(error) {
        throw new Error(`Error: ${error.message}`);
    } 
}
  

async function saveTranscriptToS3(fileName, transcriptData) {
    return new Promise((resolve, reject) => {
        const dataBuf = Buffer.from(JSON.stringify(transcriptData));

        const data = {
            Bucket: process.env.TRANSCRIPT_BUCKET, 
            Key: `${fileName}.json`,
            Body: dataBuf, 
            ContentEncoding: 'base64',
            ContentType: 'application/json',
            ACL: 'public-read'
        };

        S3.upload(data, (err, data) => {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                console.log(`${filename}.json saved successfully`);
                return resolve();
            }
        });
    });


}