import Image from "next/image";
import React from "react";
import Button from "@mui/material/Button";
import Moment from "react-moment";
import styles from "@/styles/components/EpisodeDetails.module.css";

const EpisodeDetails = ({ data }) => {
  // console.log(data);

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
        </div>
      </div>

      <Button className={styles.summarizeButton} variant="contained">
        Summarize
      </Button>
    </div>
  );
};

export default EpisodeDetails;
