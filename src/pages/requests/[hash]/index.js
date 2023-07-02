import React from "react";
import { useRouter } from "next/router";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Header from "@/components/Header";
import styles from "@/styles/RequestIndividual.module.css";
import Grid from "@mui/material/Grid";

export default function RequestIndividualPage({ user, request }) {
  //   const router = useRouter();

  const { podcast_name, show_name, status } = request;

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <h2>Summary Request Placed</h2>
        <div className={styles.textContentContainer}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 10 }}
            // style={{ marginBottom: 20 }}
          >
            <Grid item xs={2}>
              <span>Episode:</span>
            </Grid>
            <Grid item xs={10}>
              <span style={{ fontWeight: "" }}>{podcast_name}</span>
            </Grid>
            <Grid item xs={2}>
              <span>Show:</span>
            </Grid>
            <Grid item xs={10}>
              <span style={{ fontWeight: "" }}>{show_name}</span>
            </Grid>
            <Grid item xs={2}>
              <span>Status:</span>
            </Grid>
            <Grid item xs={10}>
              <span style={{ fontWeight: "" }}>{status}</span>
            </Grid>
          </Grid>

          {status === "Completed" ? (
            <div>
              <Link>Link to summary</Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

RequestIndividualPage.requireAuth = true;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  //   const {query} = context;

  //1. check if session exists
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //2. check if the user has access to the requested podcast (this also ends up checking if podcast exists)
  const userRequest = await prisma.request.findFirst({
    where: {
      userId: session.user.uid,
      hash: context.query.hash,
    },
  });
  // console.log(userRequest);
  if (!userRequest) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  return {
    props: {
      user,
      request: JSON.parse(JSON.stringify(userRequest)),
    },
  };
}
