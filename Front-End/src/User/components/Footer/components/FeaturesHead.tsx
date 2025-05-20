import React from "react";
import styles from "./FeaturesHead.module.css";

const FeaturesHead: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.head}>
        <div className={styles.headName}>ABOUT</div>
      </div>
      <div className={styles.headBody}>
        <div className={styles.bodyName}>contact us</div>
        <div className={styles.bodyName}>contact us</div>
        <div className={styles.bodyName}>contact us</div>
        <div className={styles.bodyName}>contact us</div>
        <div className={styles.bodyName}>contact us</div>
      </div>
    </div>
  );
};

export default FeaturesHead;
