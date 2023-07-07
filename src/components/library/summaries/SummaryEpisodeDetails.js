import React from "react";
import Image from "next/image";
import Moment from "react-moment";
import styles from "@/styles/components/summaries/SummaryEpisodeDetails.module.css";

const SummaryEpisodeDetails = ({ data }) => {
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
    <div className={styles.podcastDetailsContainer}>
      <Image
        src={data.image}
        width={200}
        height={200}
        alt="Podcast show image"
        style={{ borderRadius: 10 }}
      />
      <div className={styles.textContentContainer}>
        <h1 style={{ fontSize: 30, lineHeight: "1.2em" }}>
          {data.podcast_name}
        </h1>
        <h3>{data.show_name}</h3>
        <div style={{ color: "rgb(167,163,162" }}>
          <div></div>
          <div>
            <Moment format="MMM D" date={new Date(data.date)} /> ∙{" "}
            {msToTime(data.duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryEpisodeDetails;
