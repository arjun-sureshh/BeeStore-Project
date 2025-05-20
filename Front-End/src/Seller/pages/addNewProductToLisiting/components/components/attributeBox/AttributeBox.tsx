import React from "react";
import styles from "./AttributeBox.module.css";

interface AttributeBoxProps {
  attributeName?: string;
  requiredMust?: string;
}

const AttributeBox: React.FC<AttributeBoxProps> = ({
  attributeName,
  requiredMust,
}) => {
  return (
    <div className={styles.body}>
      <div className={styles.nameBox}>
        <div className={styles.name}>{attributeName}</div>
        <div className={styles.star}>{requiredMust}</div>
      </div>
    </div>
  );
};

export default AttributeBox;
