import Head from "next/head";
// import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Podcast Summariser</title>
        <meta name="description" content="Summarize podcasts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <Header />
        {/* <h1>Podcast Summariser</h1> */}
        <div>Hi, please sign in</div>
      </main>
    </>
  );
}
