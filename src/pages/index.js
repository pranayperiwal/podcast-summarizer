import Head from "next/head";
// import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   console.log("index page");
  //   if (session) {
  //     console.log(session);
  //     // User is signed in, redirect to a different page
  //     router.push("/home");
  //   }
  // }, []);

  return (
    <>
      <Head>
        <title>Podcast Summariser</title>
        <meta name="description" content="Summarize podcasts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <Header loggedIn={false} />
        {/* <h1>Podcast Summariser</h1> */}
        <div>Hi, please sign in</div>
      </main>
    </>
  );
}

export default LandingPage;
