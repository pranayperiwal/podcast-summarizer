import React, { useState } from "react";
import styles from "@/styles/components/Header.module.css";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";

function Header() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <div>Podcast Summariser</div>
      </div>
      <div className={styles.authSectionContainer}>
        <Button variant="outlined" onClick={handleOpen}>
          Sign Up / Login
        </Button>
        <LoginModal open={open} onClose={handleClose} />
      </div>
    </header>
  );
}

export default Header;
