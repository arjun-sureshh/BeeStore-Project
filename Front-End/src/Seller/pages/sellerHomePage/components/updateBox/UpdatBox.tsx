import React from "react";
import styles from "./UpdateBox.module.css";

interface UpdateBoxProps {
  numbers: number;
  headName: string;
}

const UpdatBox: React.FC<UpdateBoxProps> = ({ numbers, headName }) => {
  const formattedNumbers =
    headName === "Sales"
      ? `₹${numbers.toLocaleString("en-IN")}`
      : numbers.toString();

  return (
    <div className={styles.body}>
      <div className={styles.numbers}>{formattedNumbers}</div>
      <div className={styles.headName}>{headName}</div>
    </div>
  );
};

export default UpdatBox;
