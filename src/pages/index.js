import Head from "next/head";
// import Image from "next/image";
import styles from "@/styles/Index.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { style } from "@mui/system";

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
  
      <main className={styles.container}>
        <div className = {styles.headerContainer}>
        <Header />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contentTextContainer}>
            <div className={styles.textContainer}>
              <div className={styles.mainText}> Your AI Podcast Summarizer</div>
              <div className={styles.subText}>Get concise podcast summaries with PodCrunch AI. Powered by NLP and machine learning, stay informed without spending hours listening to each episode.</div>
              <div className={styles.buttonContainer}>
                <button className={styles.loginButton}>
                  Try Now
                </button>
                <button className = {styles.sampleButton}>
                   Free Sample
                </button>
              </div>
            </div>
          </div>
          <div className={styles.contentImageContainer}>
            <img src="music.png" className={styles.contentImage}></img>
          </div> 

        </div>
        <div className={styles.samplesContainer}>
          <div className={styles.samplesHeadingContainer}>
            <div className={styles.samplesHeading}>
              What We Offer  
            </div>
          </div>

          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Chapter Breakdowns</div>
              <div className={styles.cardSubheading}>PodCrunchAI breaks down podcasts into chapters for easy navigation.</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Spotify Integration</div>
              <div className={styles.cardSubheading}>Enter any Spotify link and get a summary instantly with PodCrunchAI.</div>
           
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Popular Podcasts Library</div>
              <div className={styles.cardSubheading}>Access summaries of popular podcasts  with PodCrunchAI's library.</div>
           
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default LandingPage;
