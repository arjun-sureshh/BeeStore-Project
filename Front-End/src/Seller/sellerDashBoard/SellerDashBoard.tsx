import React from "react";
import styles from "./SellerDashBoard.module.css";
import NavBar from "../components/navBar/NavBar";
import SellerRouters from "../sellerRouters/SellerRouters";

const SellerDashBoard: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.navBar}>
        <NavBar />
      </div>
      <div className={styles.content}>
        <SellerRouters />
      </div>
    </div>
  );
};

export default SellerDashBoard;
