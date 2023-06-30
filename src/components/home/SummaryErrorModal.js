import React from "react";
import Modal from "@mui/material/Modal";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { shake_128 } from "js-sha3";
import styles from "@/styles/components/home/ConfirmSummaryModal.module.css";

const SummaryErrorModal = ({
  handleClose,
  open
}) => {
  const handleConfirm = () => {
    //1. get the hash for the podcast
   // generateHash(podcastName, showName);

    //2. store the entry in the request table

    //3. store the request with the user?
    //4. if it all works out, then route the user to request/hash
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="error-modal-modal-title"
        aria-describedby="error-modal-modal-description"
        className={styles.container}
      >
        <div className={styles.modalContainer}>
          <header className={styles.header}>
            <div className={styles.crossContainer}>
              <ClearIcon fontSize="small" onClick={handleClose} />
            </div>
            <h4 style={{ marginBottom: 0, marginTop: 0 }}>
              Oh Snap!
            </h4>
          </header>

          <div className={styles.contentContainer}>
            <Grid
                alignItems="center"
               justifyContent="center"          
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 10 }}
              style={{ marginBottom: 20 }}
            >
                <span style={{ fontWeight: "" }}>An error has occured while fetching the podcast!</span>
             
            </Grid>
            <Button
              variant="outlined"
              color="error"
              className={styles.confirmButton}
              onClick={handleConfirm}
            >
              Okay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SummaryErrorModal;
