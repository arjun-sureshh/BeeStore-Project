import React, { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import CartProduct from "./components/cartproduct/CartProduct";
import CartTotalPrice from "./components/cartTotalprice/CartTotalPrice";
import axios from "axios";
import { existingUserData } from "../../components/types/types";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { togglePageControlInUser } from "../../../redux/toogleSlice";

const Cart: React.FC = () => {
  const [existingUserData, setExistingUserData] =
    useState<existingUserData | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = sessionStorage.getItem("user");
      if (!token) {
        console.log("No user signed in");
        setExistingUserData(null);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: { "x-auth-token": token },
        });
        console.log("Logged user response:", response.data);
        setExistingUserData(response.data);
      } catch (error: any) {
        console.error("Error fetching user details:", {
          message: error.message,
          response: error.response?.data,
        });
        setExistingUserData(null);
        sessionStorage.removeItem("user");
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchYourCart = async () => {
      if (!existingUserData?._id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/${existingUserData._id}`,
        );
        console.log("Cart response:", response.data);
        if (response.data.success) {
          setCartItems(response.data.data || []);
        }
      } catch (error: any) {
        console.error(
          "Error fetching cart details:",
          error.response?.data || error.message,
        );
      }
    };

    fetchYourCart();
  }, [existingUserData, isChanged]);

  const checkUserAddress = async (): Promise<boolean> => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/address/getByUserId/${existingUserData?._id}`,
      );
      return response?.data?.data?.length > 0;
    } catch (error: any) {
      console.error("Error checking user address:", error);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!existingUserData) {
      navigate("/User/Login");
      return;
    }

    const hasAddress = await checkUserAddress();

    if (!hasAddress) {
      alert("Please add a delivery address before placing an order.");
      dispatch(togglePageControlInUser("Manage Addresses"));
      navigate("/User/MyAccount");
      return;
    }

    if (cartItems.length === 0) return;

    console.log(cartItems);

    setIsLoading(true);
    setError(null);

    try {
      const cartIds = cartItems.map((item) => item.cart_Id).filter(Boolean);
      console.log(cartIds);

      const response = await axios.post(
        "http://localhost:5000/api/cart/place-order",
        {
          userId: existingUserData._id,
          cartIds,
          totalAmount: totalPrice.toString(),
        },
      );

      if (response.data.success) {
        setIsChanged(!isChanged);
        setCartItems([]);

        sessionStorage.setItem("bookingID", response.data.bookingId);
        navigate("/User/confirmOrder");
      }
    } catch (error: any) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message,
      );
      setError("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div>
        <div className={styles.product}>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartProduct
                setIsChanged={setIsChanged}
                existingUserData={existingUserData}
                key={index}
                cartItem={item}
              />
            ))
          ) : (
            <div className={styles.noItems}>Your cart is empty</div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.placeOrderSection}>
            <button
              className={styles.placeOrderButton}
              disabled={cartItems.length === 0 || isLoading}
              onClick={handlePlaceOrder}
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        )}
      </div>

      <div className={styles.totalPrice}>
        <CartTotalPrice cartItems={cartItems} setTotalPrice={setTotalPrice} />
      </div>
    </div>
  );
};

export default Cart;
