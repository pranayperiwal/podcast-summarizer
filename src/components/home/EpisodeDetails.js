import Image from "next/image";
import React from "react";
import Button from "@mui/material/Button";
import Moment from "react-moment";
import styles from "@/styles/components/home/EpisodeDetails.module.css";
import ConfirmSummaryModal from "./ConfirmSummaryModal";
import SummaryErrorModal from "./SummaryErrorModal";
import LoadingModal from "./LoadingModal";

const EpisodeDetails = ({ data }) => {
  // console.log(data);
  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [loadingOpen, setLoadingOpen] = React.useState(false);

  const [podcastTitleReturnedFromScraper, setPodcastTitleReturnedFromScraper] =
    React.useState("");
  const [podcastLinkReturnedFromScraper, setPodcastLinkReturnedFromScraper] =
    React.useState(null);

  /* Mock sleep */
  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // const handleClose = () => {}
  // getAudioLink(data.show.name, data.name);
  const handleOpen = () => {
    // getAudioLink(data.show.name, data.name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
    setLoadingOpen(false);
  };

  function pad(n) {
    return ("00" + n).slice(-2);
  }

  function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
  }

  /**
   * Gets the audio of the podcast
   */
  // async function handleOpen(showName, episodeName) {
  //   try {
  //     setLoadingOpen(true);
  //     // await sleep(2000);
  //     console.log("OK");
  //     const url = `http://localhost:3000/api/audio?showName=${encodeURIComponent(
  //       showName
  //     )}&episodeName=${encodeURIComponent(episodeName)}`;
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     setLoadingOpen(false);

  //     if (data.error) {
  //       setErrorOpen(true);
  //       console.error(
  //         "There was a problem with the fetch operation:",
  //         data.error
  //       );
  //     } else {
  //       console.log(data);
  //       setPodcastLinkReturnedFromScraper(data.link);
  //       setPodcastTitleReturnedFromScraper(data.title);
  //       setOpen(true);
  //     }
  //   } catch (error) {
  //     setErrorOpen(true);
  //     console.error("There was a problem with the fetch operation:", error);
  //   }
  // }

  // Function to get the summary of the episode
  function generateSummary() {
    // Get the audio link
  }

  return (
    <div className={styles.container}>
      <div className={styles.podcastDetailsContainer}>
        <Image
          src={data.images[1].url}
          width={200}
          height={200}
          alt="Podcast show image"
          style={{ borderRadius: 10 }}
        />
        <div className={styles.textContentContainer}>
          <h1 className={styles.episodeName}>{data.name}</h1>
          <h3>{data.show.name}</h3>
          <div style={{ color: "rgb(167,163,162" }}>
            <div></div>
            <div className={styles.date}>
              <Moment format="MMM D" date={new Date(data.release_date)} /> ∙{" "}
              {msToTime(data.duration_ms)}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              className={styles.summarizeButton}
              variant="contained"
              onClick={() => handleOpen(data.show.name, data.name)}
            >
              Request Summary
            </Button>
          </div>
        </div>
      </div>

      <LoadingModal handleClose={handleClose} open={loadingOpen} />
      <ConfirmSummaryModal
        handleClose={handleClose}
        open={open}
        podcastName={data.name}
        podcastLink={podcastLinkReturnedFromScraper}
        podcastDuration={data.duration_ms}
        showName={data.show.name}
        showImage={data.images[1].url}
        podcastReleaseDate={data.release_date}
      />
      {/* <SummaryErrorModal handleClose={handleClose} open={errorOpen} /> */}
    </div>
  );
};

export default EpisodeDetails;
