import React, { useState, useEffect } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/Request.module.css";
import Header from "@/components/Header";
import LibraryDataTable from "@/components/library/LibraryDataTable";
import { useRouter } from "next/router";
import RequestConfirmedModal from "@/components/library/RequestConfirmedModal";

export default function LibraryMainPage({ user, requests }) {
  const router = useRouter();

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
      <div className={styles.contentContainer}>
        <h2>Library</h2>
        <div className={styles.tableContainer}>
          <LibraryDataTable requests={requests} />
        </div>
        <div>
          <RequestConfirmedModal open={modalOpen} handleClose={handleClose} />
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
    where: {
      userId: session.user.uid,
    },
  });

  // console.log(userRequests);

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
