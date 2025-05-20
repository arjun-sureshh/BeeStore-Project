import React from "react";
import styles from "./Table.module.css";

interface TableProps {
  headnames: string[];
  data?: string[][];
}

const Table: React.FC<TableProps> = ({ headnames, data = [] }) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        {/* Header Row */}
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.cell}>#</div>
          {headnames.map((name, index) => (
            <div key={index} className={styles.cell}>
              {name}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <div className={styles.cell}>{rowIndex + 1}</div>
              {row.map((value, colIndex) => (
                <div key={colIndex} className={styles.cell}>
                  {value}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className={styles.noData}>No data available</div>
        )}
      </div>
    </div>
  );
};

export default Table;
