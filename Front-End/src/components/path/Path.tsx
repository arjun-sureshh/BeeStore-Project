import React from "react";
import styles from "./Path.module.css";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Path: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.pathsection}>
        <div className={styles.path}>
          Home{" "}
          <span className={styles.icons}>
            <MdOutlineArrowForwardIos />
          </span>{" "}
        </div>
      </div>
    </div>
  );
};

export default Path;
