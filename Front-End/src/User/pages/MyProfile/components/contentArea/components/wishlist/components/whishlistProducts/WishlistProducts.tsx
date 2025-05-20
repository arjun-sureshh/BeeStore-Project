import React from "react";
import styles from "./WishlistProducts.module.css";
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface WishlistProductsProps {
  img: string; // Using the defined ImageType
  productName: string;
  productRating: string;
  totalOrders: string;
  sellingPrice: string;
  MRP: string;
  offerPer: string;
  productvaraintId: string;
  minimumQty: number;
  productstock: number;
  deleteFromWishlist: (productvaraintId: string) => Promise<void>; // Corrected name and type
  handleAddToCart: (
    productvaraintId: string,
    minimumQty: number,
    productstock: number,
  ) => Promise<void>;
}

const WishlistProducts: React.FC<WishlistProductsProps> = ({
  handleAddToCart,
  deleteFromWishlist,
  minimumQty,
  productstock,
  productvaraintId,
  img,
  productName,
  productRating,
  totalOrders,
  sellingPrice,
  MRP,
  offerPer,
}) => {
  return (
    <div className={styles.body}>
      <div className={styles.imageSection}>
        <img src={img} alt="product img" />
      </div>
      <div className={styles.discriptionSection}>
        <div className={styles.productNameSection}>
          <div className={styles.productName}>{productName}</div>
          <div className={styles.deletandCart}>
            <div
              className={styles.addtoCart}
              onClick={() =>
                handleAddToCart(productvaraintId, productstock, minimumQty)
              }
            >
              Add to Cart
            </div>
            <div
              className={styles.delete}
              onClick={() => deleteFromWishlist(productvaraintId)}
            >
              <MdDelete />
            </div>
          </div>
        </div>
        <div className={styles.ratingsection}>
          <div className={styles.rating}>
            <span className={styles.avgRating}>
              {productRating} <FaStar />
            </span>
            <span className={styles.totalRating_Review}>
              <span className={styles.totalorders}>({totalOrders})</span>
            </span>
          </div>
        </div>

        <div className={styles.pricesection}>
          <span className={styles.sellingPrice}>₹{sellingPrice}</span>
          <span className={`${styles.MRP} ${styles.strick}`}>₹{MRP}</span>
          <span className={styles.offerPer}>{offerPer}% off</span>
        </div>
      </div>
    </div>
  );
};

export default WishlistProducts;
