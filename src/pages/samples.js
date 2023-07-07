import React, { useEffect, useState } from "react";
import styles from "@/styles/Sample.module.css";
import EpisodeDetails from "@/components/samples/EpisodeDetails";
import data from "@/data/samplesEpisodeData.json";

const SamplesPage = () => {
  const hubermanLabs =
    "https://open.spotify.com/episode/42F7z6Z4CB8hJAstRqMCiV?si=6PAJZ0EDSeOCr2VGEX4Y_w";
  const diaryOfACEO =
    "https://open.spotify.com/episode/6yMJm54OynytyjmTwqaZhU?si=w_9-q9znRT2o6j3VErbjSQ";

  const dataURLs = [hubermanLabs, diaryOfACEO];

  return (
    <div className={styles.container}>
      <div className={styles.headerText}>
        <h2>Sample Podcast Summaries</h2>
      </div>

      <div className={styles.contentContainer}>
        {data.map((item, index) => {
          return <EpisodeDetails key={index} data={item} />;
        })}
      </div>
    </div>
  );
};

export default SamplesPage;
