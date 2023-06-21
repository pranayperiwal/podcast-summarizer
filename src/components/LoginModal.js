import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const LoginModal = ({ open, onClose }) => {
  //   const classes = useStyles();

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    // You can use Firebase or Google Sign-In API for authentication
  };

  return (
    <Modal
      //   className={}
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
