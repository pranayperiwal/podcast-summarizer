import React, { useState, useEffect } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/Request.module.css";
import Header from "@/components/Header";
import LibraryDataTable from "@/components/library/LibraryDataTable";
import { useRouter } from "next/router";
import RequestConfirmedModal from "@/components/library/RequestConfirmedModal";
import { prisma } from "@/pages/api/auth/[...nextauth]";
import EpisodeCard from "./episodeCard";


export default function LibraryMainPage({ user, requests }) {
  const router = useRouter();

  requests.sort((a, b) => a.status > b.status ? 1 : -1);
  console.log(requests);

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
      <div class="bg-white">
      <div class="mx-10 max-w-2xl px-8 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div class="flex justify-between"> 
          <div>
          <h2 class="text-4xl font-bold tracking-tight text-slate-900 font-sans">Your Library</h2>
          <h4 class="text-base mt-3 font-normal text-gray-800 tracking-tight">Access your added summaries from here. </h4>
          </div>
          <div></div>
        </div>
        <hr class="my-4 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        <section class="py-0 mt-10">
            <div class="flex flex-row flex-wrap justify-between">
              {requests.map((request) => {
                return (
                <EpisodeCard 
                  title={request.show_name}
                  subTitle={request.podcast_name}
                  imageUrl = {request.podcast.image}
                  status={request.status}
                  redirectUrl = {`/summary/${request.podcast_hash}`}
                />
                )
              })
              }
              </div>
            
          </section>

        </div>
      </div>
    </div>
  );
}

LibraryMainPage.requireAuth = true;

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
  const userRequests = await prisma.request.findMany({
    include: {
      podcast: {
        select: {
          image: true
        }
      }
    },
    where: {
      userId: session.user.uid,
    },
  });



  console.log(userRequests);

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  return {
    props: {
      user,
      requests: JSON.parse(JSON.stringify(userRequests)),
    },
  };
}
