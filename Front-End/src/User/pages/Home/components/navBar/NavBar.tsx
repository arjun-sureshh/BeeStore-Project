import React from "react";
import styles from "./NavBar.module.css";

const NavBar: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.webName}></div>
      <div className={styles.searchBar}></div>
      <div className={styles.balanceOptions}></div>
    </div>
  );
};

export default NavBar;
