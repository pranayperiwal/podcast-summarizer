import Image from "next/image";
import React from "react";
import Button from "@mui/material/Button";
import Moment from "react-moment";
import styles from "@/styles/components/home/EpisodeDetails.module.css";
import ConfirmSummaryModal from "./ConfirmSummaryModal";
import SummaryErrorModal from "./SummaryErrorModal";
import LoadingModal from "./LoadingModal";

const EpisodeDetails = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [loadingOpen, setLoadingOpen] = React.useState(false);

  /* Mock sleep */
  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // const handleClose = () => {}
  // getAudioLink(data.show.name, data.name);
  // const handleOpen = () => {
  //   getAudioLink(data.show.name, data.name);
  //   setOpen(true);
  // };

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

  async function makeTranscriptRequest() {
    const podcastDetails = {
      hash: '1234567890',
      audioUrl: 'https://example.com/podcast.mp3'
    };

    try {
      const response = await fetch('http://localhost:3000/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(podcastDetails)
      });
    
      const data = await response.json();
      console.log(data);
    } catch (error) {
      throw new Error("Error making transcript request - " + error.message);  
    }
}

  /**
   * Gets the audio of the podcast
   */
  async function handleOpen(showName, episodeName) {
    try {
      setLoadingOpen(true);
      await sleep(2000);
      console.log("OK");
      const url = `http://localhost:3000/api/audio?showName=${encodeURIComponent(
        showName
      )}&episodeName=${encodeURIComponent(episodeName)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
     
      const data = await response.json();
    
      await makeTranscriptRequest();
     
      setLoadingOpen(false);
    
      setOpen(true);
    } catch (error) {
      setErrorOpen(true);
      console.error("There was a problem with the fetch operation:", error);
    }
  }

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
          <h1 style={{ fontSize: 30, lineHeight: "1.2em" }}>{data.name}</h1>
          <h3>{data.show.name}</h3>
          <div style={{ color: "rgb(167,163,162" }}>
            <div></div>
            <div>
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
