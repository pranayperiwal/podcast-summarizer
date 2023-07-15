import React from "react";
import { authOptions, prisma } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import styles from "@/styles/SummaryIndividual.module.css";
import SummaryEpisodeDetails from "@/components/library/summaries/SummaryEpisodeDetails";
import ChaptersContainer from "@/components/library/summaries/ChaptersContainer";

const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY_ID,
  },
});

const SummaryIndividualPage = ({
  user,
  request,
  podcastInfo,
  chapterSummary,
}) => {
  const podcastInfoJSON = JSON.parse(podcastInfo);
  const dummyData = {
    podcast_name: podcastInfoJSON["episode_name"],
    show_name: podcastInfoJSON["show_name"],
    duration: podcastInfoJSON["duration"],
    date: new Date(),
    image: podcastInfoJSON["image"],
    chapters: chapterSummary["summary"],
  };

  const { chapters, ...podcast_details } = dummyData;
  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div
        className="pt-10 w-11/12 sm:w-10/12 lg:w-8/12 max-w-screen-lg flex-col items-center p-1"
        // style={{ border: "1px solid red" }}
      >
        <div className="w-full mb-10">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Podcast Summary
          </h2>
          <h4 className="text-base mt-3 font-normal text-gray-800 tracking-tight">
            View the chapter wise summary for your purchased podcasts.
          </h4>
          <hr className="my-4 h-0.5 border-t-0 bg-neutral-100 opacity-800 dark:opacity-50" />
        </div>

        <SummaryEpisodeDetails className="mt-8" data={podcast_details} />
        <ChaptersContainer chapters={chapterSummary["summary"]} />
      </div>
    </div>
  );
};

export default SummaryIndividualPage;

SummaryIndividualPage.requireAuth = true;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  //1. check if session exists
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // 2. check if requested summary is for the user and is completed
  const userRequest = await prisma.request.findFirst({
    where: {
      userId: session.user.uid,
      podcast_hash: context.query.hash,
      status: "Completed",
    },
  });
  // console.log(userRequest);
  if (!userRequest) {
    return {
      redirect: {
        destination: "/library",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  const podcast_information = await prisma.podcast.findUnique({
    where: {
      hash: context.query.hash,
    },
  });

  const chapterSummary = await getObject(`${context.query.hash}.json`);

  return {
    props: {
      user,
      request: JSON.parse(JSON.stringify(userRequest)),
      podcastInfo: JSON.stringify(podcast_information),
      chapterSummary: JSON.parse(chapterSummary),
    },
  };
}

function getObject(key) {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({
      Bucket: "podcrunch-summaries",
      Key: key,
    });

    try {
      const response = await client.send(getObjectCommand);

      // Store all of data chunks returned from the response data stream
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks = [];

      // Handle an error while streaming the response body
      response.Body.once("error", (err) => reject(err));

      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on("data", (chunk) => responseDataChunks.push(chunk));

      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once("end", () => resolve(responseDataChunks.join("")));
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  });
}
