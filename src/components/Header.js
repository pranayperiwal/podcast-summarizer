import React, { useState } from "react";
import styles from "@/styles/components/Header.module.css";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
import { signOut, signIn } from "next-auth/react";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Header({ loggedIn }) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <div>Podcast Summariser</div>
      </div>

      {loggedIn ? (
        <div className={styles.linksContainer}>
          <Link className={styles.linkItem} href="/home">
            Home
          </Link>
          <Link className={styles.linkItem} href="/my-summaries">
            My Summaries
          </Link>
          <Link className={styles.linkItem} href="/about">
            About
          </Link>
        </div>
      ) : (
        <div className={styles.linksContainer}></div>
      )}

      <div className={styles.authSectionContainer}>
        {loggedIn ? (
          // <div>
          //   <Button variant="outlined" onClick={handleLogout}>
          //     Logout
          //   </Button>
          // </div>
          <div>
            <Button
              variant="outlined"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              My Account
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              className={styles.menu}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <>
            <Button variant="outlined" onClick={handleOpenModal}>
              Sign Up / Login
            </Button>
            <LoginModal open={openModal} onClose={handleCloseModal} />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
