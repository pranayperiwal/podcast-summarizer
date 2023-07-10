import React from "react";
import Moment from "react-moment";
import Image from "next/image";
import styles from "@/styles/components/samples/EpisodeDetails.module.css";
import { Button } from "@mui/material";
import ChaptersContainer from "./ChaptersContainer";

const EpisodeDetails = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        src={data.images[1].url}
        width={200}
        height={200}
        alt="Podcast show image"
        style={{ borderRadius: 10 }}
      />
      <div className={styles.textContentContainer}>
        <h1 style={{ fontSize: 23, lineHeight: "1.2em" }}>{data.name}</h1>
        <h4>{data.show.name}</h4>
        <div className={styles.subSubContainer}>
          <div style={{ marginRight: 20 }}>
            <Moment format="MMM D" date={new Date(data.release_date)} /> ∙{" "}
            {msToTime(data.duration_ms)}
          </div>
          <Button
            onClick={handleOpen}
            className={styles.summaryButton}
            variant="outlined"
            sx={{
              "color": "#8758FF",
              "borderColor": "#8758FF",
              "&:hover": {
                borderColor: "#8758FF",
              },
            }}
          >
            Summary
          </Button>
        </div>
        <ChaptersContainer
          chapters={data.chapters}
          open={open}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
};

export default EpisodeDetails;
