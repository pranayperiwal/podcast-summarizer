import React from "react";
import Modal from "@mui/material/Modal";
import styles from "@/styles/components/home/InitialInformationModal.module.css";
import ClearIcon from "@mui/icons-material/Clear";

const InitialInformationModal = ({ open, handleClose }) => {
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
          <h4 style={{ marginBottom: 0, marginTop: 0 }}>Welcome!</h4>
        </header>

        <div className={styles.mainTextContainer}>
          <div>
            To get you started, we have added $20 credits to your account.
          </div>
          <div>Have fun summarising! </div>
        </div>
      </div>
    </Modal>
  );
};

export default InitialInformationModal;
