import React from "react";
import styles from "./ProductPhoto.module.css";
import { LuImagePlus } from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";

interface ProductPhotoProps {
  displyaimageblockFn: () => void;
  saved?: boolean; // Add this line to support the saved prop
}

const ProductPhoto: React.FC<ProductPhotoProps> = ({
  displyaimageblockFn,
  saved,
}) => {
  const images = useSelector((state: RootState) => state.toggle.images);

  return (
    <div className={styles.body}>
      <div className={styles.titleSection}>
        <div className={styles.flex}>
          <div className={`${styles.icon} ${saved ? styles.iconSaved : ""}`}>
            <IoCheckmarkCircle />
          </div>
          <div className={styles.title}> Product Photos ({images.length})</div>
        </div>
        <div className={styles.Editbtn} onClick={displyaimageblockFn}>
          Edit
        </div>
      </div>
      <div className={styles.ImageSection}>
        <span className={styles.mainicon} onClick={displyaimageblockFn}>
          <LuImagePlus />
        </span>
      </div>
    </div>
  );
};

export default ProductPhoto;
