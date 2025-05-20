import React, { useState, useEffect } from "react";
import styles from "./ImageShow.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdFlash } from "react-icons/io";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  existingUserData,
  ProductVariant,
} from "../../../../components/types/types";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

interface ImageShowProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  setSelectedVariant?: React.Dispatch<
    React.SetStateAction<ProductVariant | undefined>
  >;
  existingUserData?: existingUserData;
  handleBuyNow: () => Promise<void>;
  isOutOfStock: boolean; // New prop
}

const ImageShow: React.FC<ImageShowProps> = ({
  selectedVariant,
  existingUserData,
  handleBuyNow,
  isOutOfStock,
}) => {
  const baseURL = "http://localhost:5000";

  const images =
    selectedVariant?.images.map((img) => ({
      src: `${baseURL}${img}`,
      alt: `${selectedVariant.productTitle} - ${selectedVariant.colorName || "Image"}`,
    })) || [];

  const [selectedImage, setSelectedImage] = useState<string>(
    images[0]?.src || "",
  );
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const productId = location.pathname.split('/').pop(); // Extract product ID from URL (e.g., /product/123)

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0].src);
    }
  }, [selectedVariant, images]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!existingUserData?._id || !selectedVariant?.variantId) {
        setIsInWishlist(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/wishlist/status",
          {
            params: {
              userId: existingUserData._id,
              varientId: selectedVariant.variantId,
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
  }, [existingUserData, selectedVariant]);

  const handleThumbnailClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleImageHover = (src: string) => {
    setHoverImage(src);
  };

  const handleHoverLeave = () => {
    setHoverImage(null);
  };

  const displayedImage = hoverImage || selectedImage;

  const handleWishlistToggle = async () => {
    if (isLoading) return;
    if (!existingUserData?._id) {
      navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
      return;
    }
    if (!selectedVariant?.variantId) {
      console.error("No variant selected");
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        const payload = {
          varientId: selectedVariant.variantId,
          userId: existingUserData._id,
        };
        const response = await axios.delete(
          "http://localhost:5000/api/wishlist",
          { data: payload },
        );
        if (response.data.success) {
          setIsInWishlist(false);
        } else {
          console.error("Wishlist toggle failed:", response.data.message);
        }
      } else {
        const payload = {
          varientId: selectedVariant.variantId,
          userId: existingUserData._id,
        };
        const response = await axios.post(
          "http://localhost:5000/api/wishlist",
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

  const handleAddToCart = async () => {
    if (!existingUserData?._id) {
      console.log("No user logged in, redirecting to login");
      return navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }
    if (!selectedVariant?.variantId) {
      console.error("No variant selected");
      return;
    }
    if (isOutOfStock) {
      return alert("This product is out of stock.");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/cart", {
        cartQty: selectedVariant.minimumOrderQty,
        variantId: selectedVariant.variantId,
        userId: existingUserData._id,
      });

      if (response.status === 201) {
        navigate("/User/Cart");
      } else if (
        response.status === 400 &&
        response.data.message === "This product variant is already in your cart"
      ) {
        navigate("/User/Cart");
      }
    } catch (error: any) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message,
      );
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.imageSection}>
        <div className={styles.sideMultiImages}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.sideImage} ${image.src === selectedImage ? styles.selectedImage : ""}`}
              onClick={() => handleThumbnailClick(image.src)}
              onMouseEnter={() => handleImageHover(image.src)}
              onMouseLeave={handleHoverLeave}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
        <div className={styles.mainImage}>
          {displayedImage ? (
            <img src={displayedImage} alt="main product" />
          ) : (
            <div className={styles.noImage}>No image available</div>
          )}
          <button
            className={`${styles.wishlistButton} ${isInWishlist ? styles.wishlistActive : styles.wishlistInactive}`}
            onClick={handleWishlistToggle}
            disabled={isLoading}
          >
            <FavoriteIcon
              style={{
                fontSize: "20px",
                color: isInWishlist ? "#da0606" : "#9f9f9e",
              }}
            />
          </button>
        </div>
      </div>
      <div className={styles.buySection}>
        <div
          className={`${styles.Button} ${styles.yellowishOrange} ${isOutOfStock ? styles.disabled : ""}`}
          onClick={isOutOfStock ? undefined : handleAddToCart}
        >
          <FaShoppingCart /> Go to Cart
        </div>
        <div
          className={`${styles.Button} ${styles.Orange} ${isOutOfStock ? styles.disabled : ""}`}
          onClick={isOutOfStock ? undefined : handleBuyNow}
        >
          <IoMdFlash /> Buy Now
        </div>
      </div>
    </div>
  );
};

export default ImageShow;
