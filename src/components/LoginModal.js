import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import { useSession, signIn } from "next-auth/react";
import styles from "@/styles/components/LoginModal.module.css";

const LoginModal = ({ open, onClose }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !isRedirecting && router.isReady) {
      // display some message to the user that he is being redirected
      setIsRedirecting(true);
      setTimeout(() => {
        // redirect to the return url or home page
        router.push(router.query.returnUrl || "/");
      }, 2000);
    }
  }, [session, isRedirecting, router]);

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    // You can use Firebase or Google Sign-In API for authentication
    signIn("google", {
      callbackUrl: "http://localhost:3000/home",
    });
  };

  return (
    <Modal
      className={styles.container}
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <div className={styles.modalContainer}>
        <header className={styles.header}>
          <div className={styles.crossContainer}>
            <ClearIcon fontSize="small" onClick={onClose} />
          </div>
          <h4 style={{ marginBottom: 0, marginTop: 0 }}>Log in or Sign Up</h4>
        </header>

        <div className={styles.loginProviderContainer}>
          <div style={{ fontSize: 25, position: "relative", bottom: 50 }}>
            Welcome to PodSum
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoogleLogin}
            className={styles.loginButton}
          >
            <Image
              src="/google-logo.png"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
