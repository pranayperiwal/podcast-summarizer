const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const client = new S3Client({ 
    region: "ap-southeast-1",
    credentials:{
     accessKeyId:'AKIA3OEUKNMLKG5YAFCT',
     secretAccessKey:'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'
    }
});
        
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

        console.log(`Got transcript for ${hashValue}`);

        // If the request is processing cancel future processes
        if (await checkRequestStatus(hashValue, "Processing")) {
            return res.status(200).json({ message: "Request Complete" });
        }

        await updateRequestDbStatus(hashValue, "Processing");

        // Get the transcript 
        const transcriptFile = await getTranscriptFile(transcript_id);
        console.log("Got Transcript File. Generating Summary...");

        const summary =  await generateSummary(transcriptFile);
        console.log("Generated Summary.");

        const summaryJson = {
            "summary": summary
        };

        // Upload to S3 
        await saveTranscriptToS3(hashValue, summaryJson);

        // Update the status of the request 
        await updateRequestDbStatus(hashValue, "completed");
        console.log("Updated DB Status");


        return res.status(200).json(
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
    const dataBuf = Buffer.from(JSON.stringify(transcriptData));

    const data = new PutObjectCommand({
        Bucket: process.env.TRANSCRIPT_BUCKET, 
        Key: `${fileName}.json`,
        Body: dataBuf, 
    });

    const response = await client.send(data);
    console.log(response);

}

async function generateSummary(transcriptFile) {       
    let utteranceIndex = 0;

    let summary = [];
    let chapterNumber = 1;

    for (const chapter of transcriptFile.chapters) {
        console.log(`Generating for Chapter: ${chapterNumber}`);
        let start = chapter["start"];
        let end = chapter["end"];
        chapterNumber++;

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
        summary.push({
            title: chapter["gist"],
            summary: chatCompletion.data.choices[0].message["content"],
            start: start, 
            end: end
        });
    }

    return summary;
}

function generatePrompt() {
    return "You are given the task to summarise a transcribed script of a podcast. Break down the text into relevant chapters and summarise each chapter capturing main details and key points. Make sure the summary includes relevant details and examples that support the main ideas while avoiding any unnecessary information or repetition. In case there is repetition across chapters then add it to the existing chapter";
}


async function updateRequestDbStatus(podcastHash, newStatus) {
    await prisma.request.update({
        where: {
            podcast_hash: podcastHash
        },
        data: {
            status: newStatus
        }
    });
}

async function checkRequestStatus(podcastHash, checkStatus) {
    const currentStatus = await prisma.request.findUnique({
        where: {
            podcast_hash: podcastHash
        },
        select: {
            status: true
        }
    });

    
    if (currentStatus["status"] == checkStatus) {
        console.log(`Request is ${checkStatus}`);
        return true;
    } else {
        console.log(`Request is not ${checkStatus}`);
        return false;
    }
}