import React from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/Request.module.css";
import Header from "@/components/Header";
import RequestsDataTable from "@/components/requests/RequestsDataTable";

export default function RequestMainPage({ user, requests }) {
  // console.log(requests);

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <h2>Requests</h2>
        <div className={styles.tableContainer}>
          <RequestsDataTable requests={requests} />
        </div>
      </div>
    </div>
  );
}

RequestMainPage.requireAuth = true;

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
