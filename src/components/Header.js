import React, { useState } from "react";
import styles from "@/styles/components/Header.module.css";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
import { signOut, signIn } from "next-auth/react";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/router";

function Header({ loggedIn, credits }) {
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

  const router = useRouter();

  const handleLogout = () => {
    signOut({
      callbackUrl: "http://localhost:3000/",
    });
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <div onClick={() => router.push("/home")}>PodCrunch AI</div>
      </div>

      {loggedIn ? (
        <div className={styles.linksContainer}>
          <Link className={styles.linkItem} href="/home">
            Home
          </Link>
          <Link className={styles.linkItem} href="/aboutUs">
            About
          </Link>
          <Link className={styles.linkItem} href="/summaries">
            Summaries
          </Link>
          <Link className={styles.linkItem} href="/requests">
            Requests
          </Link>
        </div>
      ) : (
        <div className={styles.linksContainer}></div>
      )}

      <div className={styles.authSectionContainer}>
        {loggedIn ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // border: "1px solid red",
              width: 210,
            }}
          >
            <div style={{ fontSize: 13 }}>Credits: ${credits}</div>
            <Button
              variant="outlined"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              style={{ fontSize: 14 }}
            >
              Account
            </Button>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose} style={{ width: 200 }}>
                <AccountCircleIcon style={{ marginRight: 10 }} />
                Profile
              </MenuItem>

              <MenuItem onClick={handleLogout} style={{ width: 200 }}>
                <LogoutRoundedIcon style={{ marginRight: 10 }} />
                Logout
              </MenuItem>
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
