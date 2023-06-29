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
      }}
    >
      {children}
      <Footer />
    </div>
  );
}

export default PostAuthLayout;
