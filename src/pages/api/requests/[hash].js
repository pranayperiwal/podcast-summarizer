import { PrismaClient } from "@prisma/client";
import { incomingRequestEmailNotification } from "@/utils/email/IncomingRequestEmailNotifcation";
import { sendConfirmationEmail } from "@/utils/email/ConfirmationEmailSender";
const prisma = new PrismaClient();

async function createTranscriptRequest(host, hash, audioUrl) {
  const url = "http://" + host + "/api/transcript";
  const body = {
    hash: hash,
    audioUrl: audioUrl,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(data);
}

export default async function handler(req, res) {
  const {
    data,
    creditsRequired,
    showImage,
    podcastReleaseDate,
    podcastDuration,
    podcastLink,
  } = req.body;

  //check all the errors

  try {
    //check if the request hasnt been made previously, if it has, raise error
    const prevRequestMadeResponse = await prisma.request.findMany({
      where: {
        podcast_hash: data.podcast_hash,
        userId: data.userId,
      },
    });
    if (prevRequestMadeResponse.length) {
      throw new Error("Request made earlier");
    }

    //check if enough credits
    const { credits } = await prisma.user.findUnique({
      where: {
        user_id: data.userId,
      },
      select: {
        credits: true,
      },
    });

    if (credits < creditsRequired) {
      throw new Error("Not enough credits");
    }

    //database updates as a transaction
    const updateDatabases = async () => {
      try {
        const result = await prisma.$transaction([
          prisma.podcast.upsert({
            where: { hash: data.podcast_hash },
            update: {},
            create: {
              hash: data.podcast_hash,
              duration: podcastDuration,
              image: showImage,
              date: new Date(podcastReleaseDate),
              episode_name: data.podcast_name,
              show_name: data.show_name,
              mp3_url: podcastLink,
            },
          }),

          prisma.request.create({ data }),

          prisma.user.update({
            where: {
              user_id: data.userId,
            },
            data: {
              credits: credits - creditsRequired,
            },
          }),

          prisma.creditsSpent.create({
            data: {
              userId: data.userId,
              date: new Date(),
              quantity: creditsRequired,
              podcast_hash: data.podcast_hash,
            },
          }),
        ]);

        res.status(200);
        res.end(JSON.stringify(result));
        if (result.length) {
          // send request alert email to admin
          incomingRequestEmailNotification(
            data.userId,
            data.podcast_name,
            data.show_name
          );
        }
      } catch (error) {
        console.log(error);
        res.status(400).end(JSON.stringify(error));
      }
    };

    updateDatabases();

    //i removed the await keyword
    //if you want to keep the await keyword, we need to not allow the above transaction to occur.
    //So we need to somehow include this in the above function, or this function must also make an entry into the podcast
    //table, so that at least the entry is present, lets talk about this on call

    createTranscriptRequest(
      req.headers.host,
      data.podcast_hash,
      "https://chrt.fm/track/97E2B5/dts.podtrac.com/redirect.mp3/traffic.omny.fm/d/clips/fa326977-3de5-4283-9b8b-af3500c58607/59fff0b5-0aab-4e5e-b71e-af4600178c59/2b79c8cf-2a62-455d-8708-b02d0040f0a8/audio.mp3?utm_source=Podcast&in_playlist=7f09fd51-ba1a-437b-9667-af4600178c62"
    );
  } catch (err) {
    console.error(err);

    if (err.message === "Request made earlier") {
      res.status(444).send("Not enough credits");
    } else if (err.message === "Not enough credits") {
      res.status(445).end(JSON.stringify(err));
    } else {
      res.status(400).end(JSON.stringify(err));
    }
    // res.json(err);
  }
}
