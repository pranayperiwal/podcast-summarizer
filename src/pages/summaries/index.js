import React from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/Summary.module.css";
import Header from "@/components/Header";

export default function SummaryMainPage({ user }) {
  // console.log(requests);

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <h2>Summaries</h2>
        <div className={styles.tableContainer}>
          {/* <RequestsDataTable requests={requests} /> */}
        </div>
      </div>
    </div>
  );
}

SummaryMainPage.requireAuth = true;

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

  //2. return all summaries of the user
  // const userRequests = await prisma.request.findMany({
  //   where: {
  //     userId: session.user.uid,
  //   },
  // });

  // console.log(userRequests);

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  return {
    props: {
      user,
      // requests: JSON.parse(JSON.stringify(userRequests)),
    },
  };
}
