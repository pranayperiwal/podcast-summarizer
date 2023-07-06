import { PrismaClient } from "@prisma/client";
import { incomingRequestEmailNotification } from "@/utils/email/IncomingRequestEmailNotifcation";
const prisma = new PrismaClient();

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
          //send request alert email to admin
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
