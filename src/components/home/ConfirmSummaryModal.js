import React from "react";
import Modal from "@mui/material/Modal";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { shake_128 } from "js-sha3";
import styles from "@/styles/components/home/ConfirmSummaryModal.module.css";

const ConfirmSummaryModal = ({
  handleClose,
  open,
  podcastName,
  podcastDuration,
  showName,
}) => {
  const calculateCost = (duration) => {
    if (duration > 3600000) {
      return 2;
    } else {
      return 1;
    }
  };

  const generateHash = (epName, shName) => {
    const message = epName + "+" + shName;
    const hash = shake_128(message, 256);
    return hash;
  };

  const handleConfirm = () => {
    //1. get the hash for the podcast
    generateHash(podcastName, showName);

    //2. store the entry in the request table

    //3. store the request with the user?
    //4. if it all works out, then route the user to request/hash
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
              Summarising Podcast
            </h4>
          </header>

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
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmSummaryModal;
