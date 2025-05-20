import React from "react";
import styles from "./BestProductList.module.css";
import SingleProduct from "./components/singleProduct/SingleProduct";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";

interface BestProductLIstProps {
  title: string;
  products: Product[];
  topcategoryId: string;
}

const BestProductLIst: React.FC<BestProductLIstProps> = ({
  title,
  products,
  topcategoryId,
}) => {
  const navigate = useNavigate();

  const navigateToProductListing = () => {
    sessionStorage.setItem("clickedCategoryId", topcategoryId);
    navigate("/User/ProductListing");
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {topcategoryId && (
          <button
            className={styles.viewAllButton}
            onClick={navigateToProductListing}
          >
            View All
          </button>
        )}
      </div>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <SingleProduct  product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestProductLIst;
