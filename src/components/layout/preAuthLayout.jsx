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
        backgroundColor: "var(--main-bg-color)",
        minHeight: "100vh",
      }}
    >
      <Header loggedIn={false} />
      <main
        style={{
          flex: "1 0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PreAuthLayout;
