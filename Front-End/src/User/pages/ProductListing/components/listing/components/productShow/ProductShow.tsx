// ProductShow.tsx
import React, { useEffect, useState } from "react";
import styles from "./ProductShow.module.css";
import { FaStar } from "react-icons/fa";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router";
import { existingUserData } from "../../../../../../components/types/types";
import axios from "axios";

interface ProductShowProps {
  productId: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  brandName?: string;
  sellerName?: string;
  productColor?: string;
  avgRating?: number; // Add avgRating
  ratingCount?: number; // Add ratingCount
  existingUserData?: existingUserData | null;
  productVariantId?: string;
}

const ProductShow: React.FC<ProductShowProps> = ({
  productId,
  productTitle,
  sellingPrice,
  mrp,
  image,
  brandName,
  sellerName,
  productColor,
  avgRating,
  ratingCount,
  existingUserData,
  productVariantId,
}) => {
  const navigate = useNavigate();
  const discountPercentage =
    mrp > 0 && sellingPrice <= mrp
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;
  const baseURL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = () => {
    sessionStorage.setItem("clickedproductId", productId);
    navigate("/User/ProductView");
  };

  // Format rating count for display (e.g., 227620 -> "227,620")
 const formatRatingCount = (count?: number) => {
  if (count == null || isNaN(count)) return "0";
  return count.toLocaleString();
};

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!existingUserData?._id || !productVariantId) {
        setIsInWishlist(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/wishlist/status`,
          {
            params: {
              userId: existingUserData._id,
              varientId: productVariantId,
            },
          },
        );
        setIsInWishlist(response.data.isInWishlist || false);
      } catch (error: any) {
        console.error(
          "Error fetching wishlist status:",
          error.response?.data || error.message,
        );
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [existingUserData, productVariantId]);

  // Handler for wishlist toggle
  const handleWishlistToggle = async () => {
    if (isLoading) return;
    if (!existingUserData?._id) {
      navigate("/User/Login");
      return;
    }
    if (!productVariantId) {
      console.error("No variant selected");
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        const payload = {
          varientId: productVariantId,
          userId: existingUserData._id,
        };
        const response = await axios.delete(
          `${API_URL}/api/wishlist`,
          { data: payload },
        );
        if (response.data.success) {
          setIsInWishlist(false);
        } else {
          console.error("Wishlist toggle failed:", response.data.message);
        }
      } else {
        const payload = {
          varientId: productVariantId,
          userId: existingUserData._id,
        };
        const response = await axios.post(
          `${API_URL}/api/wishlist`,
          payload,
        );
        if (response.data.success) {
          setIsInWishlist(true);
        } else {
          console.error("Wishlist toggle failed:", response.data.message);
        }
      }
    } catch (error: any) {
      console.error(
        "Wishlist toggle error:",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageSection}>
        <img
          src={`${baseURL}${image}`}
          alt={productTitle}
          className={styles.productImage}
        />
        <div
          className={`${styles.wishlist} ${isInWishlist ? styles.wishlistActive : styles.wishlistInactive}`}
          onClick={handleWishlistToggle}
        >
          <FavoriteIcon style={{ fontSize: "20px" }} />
        </div>
      </div>
      <div className={styles.details} onClick={handleNavigate}>
        <h3 className={styles.title}>
          {brandName ? `${brandName} ${productTitle}` : productTitle}
        </h3>
        <div className={styles.rating}>
          {avgRating ? (
            <span className={styles.avgRating}>
              {avgRating.toFixed(1)} <FaStar />
            </span>
          ) : (
            <span className={styles.avgRating}>No Ratings</span>
          )}
          <span className={styles.ratingCount}>
            ({formatRatingCount(ratingCount)} Ratings)
          </span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.sellingPrice}>
            ₹{sellingPrice != null ? sellingPrice.toLocaleString() : 'N/A'}
          </span>
          {discountPercentage > 0 && (
            <>
              <span className={styles.mrp}>₹{mrp.toLocaleString()}</span>
              <span className={styles.discount}>{discountPercentage}% off</span>
            </>
          )}
        </div>
        {productColor && (
          <div className={styles.color}>
            <span>Color: </span>
            <span
              className={styles.colorSwatch}
              style={{ backgroundColor: productColor }}
            ></span>
            <span>{productColor}</span>
          </div>
        )}
        {sellerName && (
          <div className={styles.seller}>Seller: {sellerName}</div>
        )}
      </div>
    </div>
  );
};

export default ProductShow;
