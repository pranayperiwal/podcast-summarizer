import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useSession, signIn } from "next-auth/react";
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <div style={{ border: "2px solid #000", backgroundColor: "white" }}>
        <h2 id="login-modal-title">Login/Sign Up</h2>
        <p id="login-modal-description">Please sign in with Google:</p>
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
