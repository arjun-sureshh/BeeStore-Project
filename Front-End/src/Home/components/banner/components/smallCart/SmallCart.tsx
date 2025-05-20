import React from "react";
import styles from "./SmallCart.module.css";

interface SmallCartProps {
  title: string;
  item: string;
  feature: string;
  img: string;
  backgroundclr: string;
}

const SmallCart: React.FC<SmallCartProps> = ({
  title,
  item,
  feature,
  img,
  backgroundclr,
}) => {
  return (
    <div className={`${styles.body} ${styles[backgroundclr]}`}>
      <div className={styles.disSection}>
        <div className={styles.title}>{title}</div>
        <div className={styles.item}>{item}</div>
        <div className={styles.feature}>{feature}</div>
      </div>
      <div className={styles.imgSection}>
        <img src={img} alt="product" />
      </div>
    </div>
  );
};

export default SmallCart;
