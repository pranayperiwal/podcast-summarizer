import { useEffect, useState } from "react";
// import Image from "next/image";
import styles from "@/styles/Index.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/LoginModal";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    // console.log("index page");
    if (session) {
      console.log(session);
      // User is signed in, redirect to a different page
      router.push("/home");
    }
  }, []);

  return (
    <>
      <main className={styles.container}>
        <div className={styles.upperContentContainer}>
          <div className={styles.contentTextContainer}>
            <div className={styles.textContainer}>
              <div className={styles.mainText}> Your AI Podcast Summarizer</div>
              <div className={styles.subText}>
                Get concise, actionable, podcast summaries with{" "}
                <span style={{ whiteSpace: "nowrap", color: "#8758FF" }}>
                  PodCrunch AI.{" "}
                </span>
                <br />
                Stay informed without spending hours listening to each episode.
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.loginButton}
                  onClick={handleOpenModal}
                >
                  Try Now
                </button>
                <button
                  className={styles.sampleButton}
                  onClick={() => router.push("/samples")}
                >
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
            <div className={styles.samplesHeading}>What We Offer</div>
          </div>

          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Chapter Breakdowns</div>
              <div className={styles.cardSubheading}>
                PodCrunch AI breaks down podcasts into chapters for easy
                navigation.
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Spotify Integration</div>
              <div className={styles.cardSubheading}>
                Enter any Spotify link and get a summary instantly with
                <span style={{ whiteSpace: "nowrap" }}> PodCrunch AI. </span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeading}>Popular Podcasts Library</div>
              <div className={styles.cardSubheading}>
                Access summaries of popular podcasts with PodCrunch AI&apos;s
                library.
              </div>
            </div>
          </div>
        </div>

        <LoginModal open={openModal} onClose={handleCloseModal} />
      </main>
    </>
  );
}

export default LandingPage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
