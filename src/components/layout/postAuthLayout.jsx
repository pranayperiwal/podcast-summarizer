import React from "react";
import Footer from "../Footer";

function PostAuthLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <main style={{ flex: "1 0 auto", width: "100%" }}>{children}</main>
      <Footer />
    </div>
  );
}

export default PostAuthLayout;
