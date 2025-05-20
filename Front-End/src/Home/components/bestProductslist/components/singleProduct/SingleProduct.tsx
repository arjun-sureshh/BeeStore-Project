import React from "react";
import styles from "./SingleProduct.module.css";
import defaultImg from "../../../../../assets/iphone-black.jpg";
import { Product } from "../../../types";
import { useNavigate } from "react-router";

interface SingleProductProps {
  product: Product;
}

const SingleProduct: React.FC<SingleProductProps> = ({ product }) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleNavigate = () => {
    sessionStorage.setItem("clickedproductId", product.productId); // Use productId
    navigate("/User/ProductView");  
  };

  return (
    <div className={styles.body} onClick={handleNavigate}>
      <div className={styles.imgSec}>
        <img
          src={product.image ? `${baseURL}/images${product.image}` : defaultImg}
          alt={product.productTitle}
        />
      </div>
      <div className={styles.nameSec}>
        <div className={styles.productName}>{product.productTitle}</div>
        <div className={styles.price}>
        ₹{product.sellingPrice != null ? product.sellingPrice.toLocaleString() : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
