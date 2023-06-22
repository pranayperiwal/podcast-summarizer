import React, { useState } from "react";
import styles from "@/styles/components/Header.module.css";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
import { signOut, signIn } from "next-auth/react";

function Header({ loggedIn }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleLogin = () => {
  //   signIn("google", {
  //     callbackUrl: "http://localhost:3000/home",
  //   });
  // };

  const handleLogout = () => {
    signOut({
      callbackUrl: "http://localhost:3000/",
    });
  };

  if (!loggedIn) {
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
  } else {
    return (
      <header className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <div>Podcast Summariser</div>
        </div>
        <div className={styles.authSectionContainer}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
    );
  }
}

export default Header;
