import React from "react";
import Header from "../Header";
import Footer from "../Footer";

function PreAuthLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Header loggedIn={false} />
      {children}
      <Footer />
    </div>
  );
}

export default PreAuthLayout;
