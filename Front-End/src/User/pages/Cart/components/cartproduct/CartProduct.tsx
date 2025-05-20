import styles from "./CartProduct.module.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { existingUserData } from "../../../../components/types/types";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";

interface CartProductProps {
  cartItem?: {
    cart_Id?: string;
    cartQty?: number;
    productvariantId?: string;
    mrp?: number;
    sellingPrice?: number;
    sellerName?: string;
    image?: string;
    specification?: string;
    createdAt?: string;
    updatedAt?: string;
    bookingAmount?: number;
    productTitle?: string;
    productId?: string;
    minimumorder?: number;
    stockQty?: number;
  };
  existingUserData?: existingUserData | null;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartProduct: React.FC<CartProductProps> = ({
  cartItem,
  existingUserData,
  setIsChanged,
}) => {
  const baseURL = "http://localhost:5000";
  const navigate = useNavigate();
  const [cartQty, setCartQty] = useState<number>(0);

  useEffect(() => {
    if (cartItem) {
      setCartQty(cartItem.cartQty ?? cartItem.minimumorder ?? 0);
    }
  }, [cartItem]);

  const handleNavigate = () => {
    if (cartItem && cartItem.productId) {
      sessionStorage.setItem("clickedproductId", cartItem.productId);
      navigate("/User/ProductView");
    }
  };

  const handleRemove = async () => {
    if (!existingUserData?._id) {
      console.log("No user logged in, redirecting to login");
      navigate("/User/Login");
      return;
    }
    if (!cartItem?.cart_Id) {
      console.error("No cart item selected for deletion");
      alert("No cart item selected");
      return;
    }

    try {
      const response = await axios.delete("http://localhost:5000/api/cart", {
        data: { cartId: cartItem.cart_Id, userId: existingUserData._id },
      });

      if (response.data.success) {
        setIsChanged((prev: boolean) => !prev);
      } else {
        console.error("Failed to remove cart item:", response.data.message);
        alert(response.data.message || "Failed to remove item");
      }
    } catch (error: any) {
      console.error(
        "Error removing cart item:",
        error.response?.data || error.message,
      );
      alert(error.response?.data?.message || "Failed to remove item");
    }
  };

  const removeOne = async () => {
    if (!cartItem?.cart_Id) {
      console.error("No cart item selected");
      alert("No cart item selected");
      return;
    }

    if (
      cartItem.cartQty &&
      cartItem.minimumorder &&
      cartItem.cartQty <= cartItem.minimumorder
    ) {
      alert(
        `Cannot reduce quantity below minimum order of ${cartItem.minimumorder}`,
      );
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/cart/removeOne",
        {
          cart_id: cartItem.cart_Id,
        },
      );

      if (response.data.success) {
        // setIsChanged((prev: boolean) => !prev);
        setCartQty(response.data.data.cartQty);
      } else {
        console.error("Failed to remove item:", response.data.message);
        alert(response.data.message || "Failed to reduce quantity");
      }
    } catch (error: any) {
      console.error(
        "Error removing item:",
        error.response?.data || error.message,
      );
      alert(error.response?.data?.message || "Failed to reduce quantity");
    }
  };

  const addOne = async () => {
    if (!cartItem?.cart_Id) {
      console.error("No cart item selected");
      alert("No cart item selected");
      return;
    }

    if (
      cartItem.cartQty &&
      cartItem.stockQty &&
      cartItem.cartQty >= cartItem.stockQty
    ) {
      alert("Cannot add more items; stock limit reached");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/cart/addOne",
        {
          cart_id: cartItem.cart_Id,
        },
      );

      if (response.data.success) {
        // setIsChanged((prev: boolean) => !prev);
        setCartQty(response.data.data.cartQty);
      } else {
        console.error("Failed to add item:", response.data.message);
        alert(response.data.message || "Failed to increase quantity");
      }
    } catch (error: any) {
      console.error(
        "Error adding item:",
        error.response?.data || error.message,
      );
      alert(error.response?.data?.message || "Failed to increase quantity");
    }
  };

  const isMinusDisabled =
    cartItem?.cartQty &&
    cartItem?.minimumorder &&
    cartItem.cartQty <= cartItem.minimumorder;
  const isPlusDisabled =
    cartItem?.cartQty &&
    cartItem?.stockQty &&
    cartItem.cartQty >= cartItem.stockQty;

  return (
    <div className={styles.body}>
      <div className={styles.imageSection}>
        <div className={styles.productImage}>
          <img
            src={cartItem?.image ? `${baseURL}${cartItem.image}` : undefined}
            alt="product image"
          />
        </div>
      </div>
      <div className={styles.NameSection}>
        <div className={styles.name} onClick={handleNavigate}>
          {cartItem?.productTitle}
          {cartItem?.specification}
        </div>
        <div className={styles.sellerName}>
          Seller: {cartItem?.sellerName || "XONIGHT E-Commerce"}
        </div>
        <div className={styles.removefromcart} onClick={handleRemove}>
          Remove
        </div>
        <div className={styles.Addone}>
          <span
            className={`${styles.AddoneIcon} ${isMinusDisabled ? styles.disabled : ""}`}
            onClick={isMinusDisabled ? undefined : removeOne}
          >
            <CiCircleMinus />
          </span>
          <span className={styles.displayCount}>{cartQty}</span>
          <span
            className={`${styles.AddoneIcon} ${isPlusDisabled ? styles.disabled : ""}`}
            onClick={isPlusDisabled ? undefined : addOne}
          >
            <CiCirclePlus />
          </span>
        </div>
      </div>
      <div className={styles.priceSection}>
        <div className={styles.sellingPrice}>
          ₹{cartItem?.sellingPrice?.toFixed(2) || "19,998.00"}
        </div>
        <div className={styles.MRP}>
          M.R.P:{" "}
          <span className={styles.strick}>
            ₹{cartItem?.mrp?.toFixed(2) || "999.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
