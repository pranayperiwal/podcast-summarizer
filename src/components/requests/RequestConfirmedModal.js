import React from "react";
import Modal from "@mui/material/Modal";
import styles from "@/styles/components/requests/RequestConfirmedModal.module.css";
import ClearIcon from "@mui/icons-material/Clear";

const RequestConfirmedModal = ({ open, handleClose }) => {
  return (
    <Modal
      className={styles.container}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.modalContainer}>
        <header className={styles.header}>
          <div className={styles.crossContainer}>
            <ClearIcon fontSize="small" onClick={handleClose} />
          </div>
          <h4 style={{ marginBottom: 0, marginTop: 0 }}>
            Your request was placed!!
          </h4>
        </header>

        <div className={styles.mainTextContainer}>
          <div>You will get an email when the summary is available!</div>
          <div>~ PodCrunch Team</div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestConfirmedModal;
