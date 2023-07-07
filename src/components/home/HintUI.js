import React from "react";
import styles from "@/styles/components/home/HintUI.module.css";

const HintUI = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>How to get the link</div>
      <div className={styles.contentContainer}>
        <div className={styles.subContainer}>
          <div>Mobile App</div>
          <div className={styles.content}>
            <img
              src={"mobile-ss.png"}
              //   width={300}
              className={styles.image}
            />
          </div>
        </div>
        <div className={styles.subContainer}>
          <div>Web/Desktop App</div>
          <div className={styles.content}>
            <img
              src={"desktop-ss.png"}
              //   width={300}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintUI;
