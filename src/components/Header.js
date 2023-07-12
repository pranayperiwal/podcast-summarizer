import React, { useState } from "react";
import styles from "@/styles/components/Header.module.css";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuIcon from "@mui/icons-material/Menu";

import { useRouter } from "next/router";

function Header({ loggedIn, credits }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  const router = useRouter();

  const handleLogout = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  const MobileMenu = ({ credits }) => {
    return (
      <div className={styles.mobileMenu}>
        <ul className={styles.mobileMenuList}>
          <li className={styles.mobileMenuItem}>
            <Link href="/home">Home</Link>
          </li>
          <li className={styles.mobileMenuItem}>
            <Link href="/library">Library</Link>
          </li>
          <li className={styles.mobileMenuItem}>
            <div style={{ fontSize: "small", paddingTop: 15 }}>
              Credits: ${credits}
            </div>
          </li>
          <li className={styles.mobileMenuItem}>
            <div
              style={{
                // border: "1px solid red",
                alignItems: "center",
                display: "flex",
                fontSize: "small",
              }}
              onClick={handleLogout}
            >
              <LogoutRoundedIcon style={{ marginRight: 5 }} fontSize="10px" />
              Logout
            </div>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.logoContainer}>
          <div onClick={() => router.push("/home")}>
            <img src="logo-transparent.png" className={styles.logo} />
          </div>
        </div>

        {loggedIn ? (
          <div className={styles.linksContainer}>
            <Link className={styles.linkItem} href="/home">
              Home
            </Link>

            <Link className={styles.linkItem} href="/library">
              Library
            </Link>
          </div>
        ) : (
          <div className={styles.linksContainer}></div>
        )}

        <div className={styles.authSectionContainer}>
          {loggedIn ? (
            <div className={styles.authSectionContent}>
              <div className={styles.desktopAuthSectionContent}>
                <div style={{ fontSize: "small" }}>Credits: ${credits}</div>
                <Button
                  variant="outlined"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    "color": "#8758FF",
                    "borderColor": "#8758FF",
                    "&:hover": {
                      borderColor: "#8758FF",
                    },
                  }}
                  className={styles.accountButton}
                  color="primary"
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
                  <MenuItem onClick={handleLogout} style={{ width: 200 }}>
                    <LogoutRoundedIcon style={{ marginRight: 10 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </div>
              <div className={styles.menuIconContainer}>
                <MenuIcon onClick={toggleMobileMenu} />
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleOpenModal}
                className={styles.signUpButton}
                sx={{
                  "color": "#8758FF",
                  "borderColor": "#8758FF",
                  "&:hover": {
                    borderColor: "#8758FF",
                  },
                }}
              >
                Sign Up / Login
              </Button>
              <LoginModal open={openModal} onClose={handleCloseModal} />
            </>
          )}
        </div>
      </div>
      <div className={styles.mobileMenuContainer}>
        {mobileMenuOpen && <MobileMenu credits={credits} />}
      </div>
    </header>
  );
}

export default Header;
