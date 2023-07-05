import AWS from "aws-sdk"
const { Configuration, OpenAIApi } = require("openai");

const transcriptJson = require("./../../../../ai/podcast_30mins.json");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
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

        const { status, transcript_id } = req.body;
        const hashValue = req.query.params;

        
        // if (requestIsComplete(hashValue)) {
        //     console.log("Request is complete.");
        //     return res.status(200).json({ message: "Request Complete" });
        // }

        // Get the transcript 
        const transcriptFile = await getTranscriptFile(transcript_id);
        console.log("Got Transcript File. Generating Summary...");

        const summary =  await generateSummary(transcriptFile);
        console.log("Generated Summary.");

        // Update the status of the request 
        await updateRequestDbStatus(hashValue);
        console.log("Updated DB Status");

        res.status(200).json(
            { message: "Success"}
        )
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
            console.log("Polling Attempt...");
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

async function generateSummary(transcriptFile) {       
    let utteranceIndex = 0;

    let summary = [];

    for (const chapter of transcriptFile.chapters) {
        let start = chapter["start"];
        let end = chapter["end"];

        let chapterContent = "";
        chapterContent += "Chapter: " + chapter["gist"] + '\n';
        
        while (utteranceIndex < transcriptFile["utterances"].length && transcriptFile['utterances'][utteranceIndex]['end'] <= end) {
            const utterance = transcriptFile["utterances"][utteranceIndex];
            chapterContent += utterance["speaker"] + `(${utterance["start"]} - ${utterance["end"]}): \n`;
            chapterContent += utterance["text"] + "\n";
            utteranceIndex++;
        }


        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a podcast summariser. You will be given a chapter of the podcast. No need to mention the chapter name. Give a detailed summary of the chapter."},
                {role: "user", content: chapterContent}
            ],
        });
        summary.push(chatCompletion.data.choices[0].message);
    }

    return summary;
}

function generatePrompt() {
    return "You are given the task to summarise a transcribed script of a podcast. Break down the text into relevant chapters and summarise each chapter capturing main details and key points. Make sure the summary includes relevant details and examples that support the main ideas while avoiding any unnecessary information or repetition. In case there is repetition across chapters then add it to the existing chapter";
}


async function updateRequestDbStatus(podcastHash) {
    await prisma.request.update({
        where: {
            podcast_hash: podcastHash
        },
        data: {
            status: "completed"
        }
    });
}

async function requestIsComplete(podcastHash) {
    const currentStatus = await prisma.request.findUnique({
        where: {
            podcast_hash: podcastHash
        },
        select: {
            status: true
        }
    });

    console.log(currentStatus["status"]);

    console.log(currentStatus["status"] == "completed");
    
    return currentStatus["status"] == "completed";
}