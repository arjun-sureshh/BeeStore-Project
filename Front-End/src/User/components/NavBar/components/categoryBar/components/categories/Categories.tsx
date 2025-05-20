import React from "react";
import styles from "./Categories.module.css";
import { MdArrowRight } from "react-icons/md";
const Categories: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.categoryName}>
        Mobiles Accessories{" "}
        <span className={styles.arrow}>
          <MdArrowRight />
        </span>
      </div>
      <div className={styles.subcategories}>
        <div className={styles.subcategoryName}>Mobile Case</div>
        <div className={styles.subcategoryName}>Power Bank</div>
        <div className={styles.subcategoryName}>Mobile Case</div>
        <div className={styles.subcategoryName}>Mobile Case</div>
      </div>
    </div>
  );
};

export default Categories;
