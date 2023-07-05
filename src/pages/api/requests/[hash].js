import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createTranscriptRequest(hash, audioUrl) {
    const body = {
        hash: hash, 
        audioUrl: audioUrl
    };
    const response = await fetch("http://localhost:3000/api/transcript", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
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
      } catch (error) {
        console.log(error);
        res.status(400).end(JSON.stringify(error));
      }
    };

    await updateDatabases();

    await createTranscriptRequest(data.podcast_hash, "https://chrt.fm/track/97E2B5/dts.podtrac.com/redirect.mp3/traffic.omny.fm/d/clips/fa326977-3de5-4283-9b8b-af3500c58607/59fff0b5-0aab-4e5e-b71e-af4600178c59/2b79c8cf-2a62-455d-8708-b02d0040f0a8/audio.mp3?utm_source=Podcast&in_playlist=7f09fd51-ba1a-437b-9667-af4600178c62");

    

    //make request
    // const requestCreatedResponse = await prisma.request.create({ data });
    // console.log("request record created");
    // console.log(response);

    //reduce credits
    // const updateUser = await prisma.user.update({
    //   where: {
    //     user_id: data.userId,
    //   },
    //   data: {
    //     credits: credits - creditsRequired,
    //   },
    // });

    //store in CreditsSpent table
    // const credtsSpentResponse = await prisma.creditsSpent.create({
    //   data: {
    //     userId: data.userId,
    //     date: new Date(),
    //     quantity: creditsRequired,
    //     request_id: requestCreatedResponse.id,
    //   },
    // });

    //store podcast details in Podcast table

    // const podcastEntry = await prisma.podcast.upsert({
    //   where: { hash: data.hash },
    //   update: {},
    //   create: {
    //     hash: data.hash,
    //     duration: data.podcast_duration,
    //     image: data.show_image,
    //     date: new Date(podcast_release_date),
    //     episode_name: data.podcast_name,
    //     show_name: data.show_name,
    //   },
    // });

    // const podcastExists = await prisma.podcast.findUnique({
    //   where: {
    //     hash: data.hash,
    //   },
    // });

    // if (!podcastExists) {
    //   const newPocastEntry = await prisma.podcast.create({
    //     data: {
    //       hash: data.hash,
    //       duration: data.podcast_duration,
    //       image: data.show_image,
    //       date: new Date(podcast_release_date),
    //       episode_name: data.podcast_name,
    //       show_name: data.show_name,
    //     },
    //   });
    // }

    // console.log("Credits left: ", updateUser.credits);

    // res.status(200);
    // res.end(JSON.stringify(requestCreatedResponse));
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
