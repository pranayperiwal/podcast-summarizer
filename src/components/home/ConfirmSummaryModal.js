import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { shake_128 } from "js-sha3";
import { useAtom } from "jotai";
import { ColorRing } from "react-loader-spinner";

import { userUIDAtom } from "@/pages/home";
import { userEmailAtom } from "@/pages/home";

import styles from "@/styles/components/home/ConfirmSummaryModal.module.css";
import { useRouter } from "next/router";

const ConfirmSummaryModal = ({
  handleClose,
  open,
  podcastName,
  podcastLink,
  podcastDuration,
  showName,
  showImage,
  podcastReleaseDate,
}) => {
  const [userUID] = useAtom(userUIDAtom);
  const [userEmail] = useAtom(userEmailAtom);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initalState, setInitalState] = useState(true);

  const router = useRouter();

  const calculateCost = (duration) => {
    // if (duration > 3600000) {
    //   return 2;
    // } else {
    //   return 1;
    // }

    return 1;
  };

  const generateHash = (epName, shName) => {
    const message = epName + "+" + shName;
    const hash = shake_128(message, 256);
    return hash;
  };

  const handleConfirm = async () => {
    //1. get the hash for the podcast
    const hash = generateHash(podcastName, showName);

    //2. store the entry in the request table
    const body = {
      data: {
        podcast_hash: hash,
        date: new Date(),
        status: "In Progress",
        podcast_name: podcastName,
        show_name: showName,
        // show_image: showImage,
        // podcast_release_date: podcastReleaseDate,
        // podcast_duration: podcastDuration,
        userId: userUID,
      },
      creditsRequired: calculateCost(podcastDuration),
      showImage,
      podcastReleaseDate,
      podcastDuration,
      podcastLink,
      userEmail,
    };

    setInitalState(false);
    setLoading(true);

    fetch("/api/requests/" + hash, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw response.status;
        }

        setLoading(false);
        // handleClose();

        //route to new page
        router.push({
          pathname: "/library",
          query: {
            hash,
          },
        });
      })
      .catch((error) => {
        console.log("Error:", error);
        if (error === 444) {
          setError("Request for same podcast was made earlier");
        } else if (error === 445) {
          setError("Not enough credits available.");
        } else {
          setError("An unknown error occured.");
        }
        setLoading(false);
      });

    // await makeTranscriptRequest(hash);
  };

  async function makeTranscriptRequest(
    audioHash,
    audioUrl = "https://chrt.fm/track/97E2B5/dts.podtrac.com/redirect.mp3/traffic.omny.fm/d/clips/fa326977-3de5-4283-9b8b-af3500c58607/59fff0b5-0aab-4e5e-b71e-af4600178c59/2b79c8cf-2a62-455d-8708-b02d0040f0a8/audio.mp3?utm_source=Podcast&in_playlist=7f09fd51-ba1a-437b-9667-af4600178c62"
  ) {
    const podcastDetails = {
      hash: audioHash,
      audioUrl: audioUrl,
    };

    try {
      const response = await fetch("http://localhost:3000/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(podcastDetails),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      throw new Error("Error making transcript request - " + error.message);
    }
  }

  const InitialPodcastInfo = () => {
    return (
      <div className={styles.contentContainer}>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 10 }}
          style={{ marginBottom: 20 }}
        >
          <Grid item xs={3}>
            <span>Episode:</span>
          </Grid>
          <Grid item xs={9}>
            <span style={{ fontWeight: "" }}>{podcastName}</span>
          </Grid>
          <Grid item xs={3}>
            <span>Show:</span>
          </Grid>
          <Grid item xs={9}>
            <span style={{ fontWeight: "" }}>{showName}</span>
          </Grid>
          <Grid item xs={3}>
            <span>Cost:</span>
          </Grid>
          <Grid item xs={9}>
            <span style={{ fontWeight: "" }}>
              ${calculateCost(podcastDuration)}
            </span>
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          color="primary"
          className={styles.confirmButton}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    );
  };

  const Loading = () => {
    return (
      <div className={styles.contentContainer}>
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  };

  const Error = ({ error }) => {
    return (
      <div
        style={{
          backgroundColor: "rgb(224, 54, 66)",
          padding: 10,
          borderRadius: 4,
          fontSize: 17,
          color: "white",
        }}
      >
        Error: {error}
      </div>
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.container}
      >
        <div className={styles.modalContainer}>
          <header className={styles.header}>
            <div className={styles.crossContainer}>
              <ClearIcon fontSize="small" onClick={handleClose} />
            </div>
            <h4 style={{ marginBottom: 0, marginTop: 0 }}>
              Podcast Information
            </h4>
          </header>
          {initalState ? (
            <InitialPodcastInfo />
          ) : loading ? (
            <Loading />
          ) : error !== "" ? (
            <div className={styles.contentContainer}>
              <Error error={error} />
            </div>
          ) : (
            <div className={styles.contentContainer}>Rerouting...</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmSummaryModal;
