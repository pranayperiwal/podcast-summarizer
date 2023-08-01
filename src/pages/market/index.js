import React, { useState, useEffect } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/Request.module.css";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { prisma } from "@/pages/api/auth/[...nextauth]";
import MarketCard from "@/components/marketCard";

export default function MarketPlace({ user, marketRequests }) {
  const router = useRouter();

  marketRequests.sort((a, b) => (a.status > b.status ? 1 : -1));

  const specificPodcastHash = router.query?.hash;

  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    localStorage.setItem(specificPodcastHash, "true");
    setModalOpen(false);
  };

  useEffect(() => {
    if (specificPodcastHash) {
      let firstTimeRequestScreen = localStorage.getItem(specificPodcastHash);

      if (firstTimeRequestScreen !== "true") {
        // The key doesn't exist in localStorage, so it's the first time
        setModalOpen(true);
        localStorage.setItem(specificPodcastHash, "true");
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className="bg-white flex justify-center">
        <div
          className="sm:mx-10 max-w-2xl min-w-[80%] px-8 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 "
          // style={{ border: "1px solid red" }}
        >
          <div className="flex justify-between ">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 font-sans">
                Market Place
              </h2>
              <h4 className="text-base mt-3 font-normal text-gray-800 tracking-tight">
                Access your summaries from here.{" "}
              </h4>
            </div>
          </div>
          <hr className="my-4 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
          <section className="py-0 mt-10">
            <div
              className="flex flex-row flex-wrap md:justify-around justify-center"
              // style={{ border: "1px solid red" }}
            >
              {marketRequests.map((request, index) => {
                return (
                  <MarketCard
                    key={index}
                    showName={request.show_name}
                    podcastName={request.episode_name}
                    podcastDuration={request.duration}
                    podcastReleaseDate={request.date}
                    showImage ={request.image}
                    hash={request.hash}
                    userId={user.user_id}
                    podcastLink={null}
                    userEmail={null}
                    creditsRequired={1}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

MarketPlace.requireAuth = true;

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

  //2. return all requests of the user
  let marketRequests = await prisma.podcast.findMany({
    include: {
      requests: {
        where: {
          NOT: {
            userId: session.user.uid
          },
          status: "Completed"    
        }
      }
    },
  });

  let userRequests = await prisma.request.findMany({
     where: {
        userId: session.user.uid
      },
      select: {
        podcast_hash: true
      }
  });

  let userRequestsMap = {};
  for (let request of userRequests) {
    userRequestsMap[request["podcast_hash"]] = true;
  }

  marketRequests = marketRequests.filter(req => ((req.hash in userRequestsMap) === false));

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  return {
    props: {
      user,
      marketRequests: JSON.parse(JSON.stringify(marketRequests)),
    },
  };
}
