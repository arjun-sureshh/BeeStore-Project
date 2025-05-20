import React, { useEffect, useState } from "react";
import styles from "./ProductView.module.css";
import ImageShow from "./components/ImageSection/ImageShow";
import ProductDetails from "./components/DetailsSection/ProductDetails";
import axios from "axios";
import { ProductVariant } from "../../components/types/types";
import { useLocation, useNavigate, useParams } from "react-router";
import { existingUserData } from "../placeOrder/PlaceOrder";

const ProductView: React.FC = () => {
  const { productId: urlProductId } = useParams<{ productId: string }>(); // Get productId from URL
  const singleProductId =
    urlProductId || sessionStorage.getItem("clickedproductId"); // Fallback to sessionStorage
  const navigate = useNavigate();

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);
  const existingUser = sessionStorage.getItem("user");
  const [existingUserData, setExistingUserData] = useState<existingUserData>();
  const location = useLocation();

  // set user latest view
  useEffect(() => {
    const handleUserView = async () => {
      if (!singleProductId) {
        console.log("Missing productId");
        return;
      }
      if (!existingUser) {
        console.log("No token found");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/userView",
          { productId: singleProductId },
          { headers: { Authorization: `Bearer ${existingUser}` } },
        );
        console.log("View recorded:", response.data);
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };

    handleUserView();
  }, [singleProductId]);

  // useeffect for fetch productdetails

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!singleProductId) {
        setError("No product ID provided");
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/productvaraint/fetchVaraint-single-View", // Update for production
          { productId: singleProductId },
        );
        console.log("API Response in single product:", response.data);

        const variantData: ProductVariant[] = response.data.data || [];
        setVariants(variantData);
        if (variantData.length > 0) {
          setSelectedVariant(variantData[0]);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching product variants:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      const token = existingUser;
      if (!token) {
        return console.log("user not signin");
      }
      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log(response, "logeduser");
        setExistingUserData(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchUserDetails();
    fetchProductDetails();
  }, [singleProductId, navigate]);

  // Buy Now
  const handleBuyNow = async () => {
    if (!existingUserData?._id) {
      console.log("No user logged in, redirecting to login");
      return navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }

    if (!selectedVariant?.variantId) {
      console.error("No variant selected");
      return alert("Please select a product variant before buying.");
    }

    if (
      selectedVariant.stockQty === 0 ||
      selectedVariant.stockQty === undefined
    ) {
      return alert("This product is out of stock.");
    }

    try {
      const qty = selectedVariant.minimumOrderQty || 1;
      const price = selectedVariant.sellingPrice || 0;

      const totalAmount = price * qty;
      const platformFee = totalAmount * 0.01;
      const finalAmount = totalAmount + platformFee;

      const response = await axios.post(
        `http://localhost:5000/api/cart/buy-now`,
        {
          cartQty: qty,
          variantId: selectedVariant.variantId,
          userId: existingUserData._id,
          amount: finalAmount.toFixed(2),
        },
      );

      if (response.status === 201) {
        const savedCart = response.data.data;

        if (savedCart.bookingID || response.data.data.bookingId) {
          sessionStorage.setItem(
            "bookingID",
            savedCart.bookingID || response.data.data.bookingId,
          );
        }

        console.log("Buy Now success:", savedCart);
        navigate("/User/confirmOrder");
      } else {
        console.warn("Unexpected response:", response);
        alert("Failed to complete purchase. Please try again.");
      }
    } catch (error: any) {
      console.error(
        "Error during Buy Now:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Failed to complete the Buy Now process",
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.body}>
        <div className={styles.productviewPage}>
          <div className={styles.singleProductView}>
            <div className={styles.imageSide}>Loading images...</div>
            <div className={styles.detailsDisplay}>Loading details...</div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className={styles.body}>Error: {error}</div>;
  if (variants.length === 0)
    return <div className={styles.body}>No variants found.</div>;

  const isOutOfStock =
    selectedVariant?.stockQty === 0 || selectedVariant?.stockQty === undefined;

  return (
    <div className={styles.body}>
      <div className={styles.productviewPage}>
        <div className={styles.singleProductView}>
          <div className={styles.imageSide}>
            <ImageShow
              variants={variants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              existingUserData={existingUserData}
              handleBuyNow={handleBuyNow}
              isOutOfStock={isOutOfStock}
            />
          </div>
          <div className={styles.detailsDisplay}>
            {selectedVariant && (
              <ProductDetails
                variants={variants}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                isOutOfStock={isOutOfStock}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
