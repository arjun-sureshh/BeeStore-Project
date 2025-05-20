import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CancelledProducts.module.css";
import { useNavigate } from "react-router";

interface ProductVariant {
  _id: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
}

interface Gallery {
  photos: string;
}

interface CartItem {
  _id: string;
  cartQty: number;
  productvariantId: ProductVariant;
  gallery: Gallery[];
  bookingID?: string;
  cartStatus: number;
  createdAt: string;
  cancellationReason?: string;
}

interface SellerData {
  _id: string;
  storeDiscription: string;
  sellerName: string;
  sellerMobileNumber: string;
  sellerGST: string;
  sellerEmail: string;
  sellerDisplayName: string;
  qcStatus: string;
  ifscCode: string;
  createdAt: string;
  bankAccountNo: string;
  ListingStatus: string;
}

const CancelledProducts: React.FC = () => {
  const [cancelledItems, setCancelledItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerData, setSellerData] = useState<SellerData>({
    _id: "",
    storeDiscription: "",
    sellerName: "",
    sellerMobileNumber: "",
    sellerGST: "",
    sellerEmail: "",
    sellerDisplayName: "",
    qcStatus: "",
    ifscCode: "",
    createdAt: "",
    bankAccountNo: "",
    ListingStatus: "",
  });
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const token = sessionStorage.getItem("seller");
      //   console.log(token);

      if (!token) {
        navigate("/Seller");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token,
          },
        });
        setSellerData(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
        setError("Failed to fetch seller details");
      }
    };

    fetchSellerDetails();
  }, []);

  useEffect(() => {
    if (!sellerData._id) return;

    const fetchCancelledProducts = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/product/cancelled-products`,
          { sellerId: sellerData._id },
        );
        console.log(response);

        setCancelledItems(response.data.data); // Extract 'data' from response
        setLoading(false);
        console.log(response);
      } catch (err) {
        setError("Failed to fetch cancelled products");
        setLoading(false);
      }
    };

    fetchCancelledProducts();
  }, [sellerData]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.cancelledProductsContainer}>
      <h1>Cancelled Products</h1>
      {cancelledItems.length === 0 ? (
        <p className={styles.noProducts}>No cancelled products found.</p>
      ) : (
        <div className={styles.productsGrid}>
          {cancelledItems.map((item) => (
            <div key={item._id} className={styles.productCard}>
              <img
                src={
                  `${baseUrl}${item.gallery[0]?.photos}` ||
                  "/placeholder-image.jpg"
                }
                alt={item.productvariantId.productTitle}
                className={styles.productImage}
              />
              <h2>{item.productvariantId.productTitle}</h2>
              <p>Quantity: {item.cartQty}</p>
              <p>Price: ₹{item.productvariantId.sellingPrice}</p>
              <p>MRP: ₹{item.productvariantId.mrp}</p>
              <p>
                Cancelled On: {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.cancellationReason ? (
                <p className={styles.cancellationReason}>
                  Reason: {item.cancellationReason}
                </p>
              ) : (
                <p className={styles.noReason}>
                  No cancellation reason provided
                </p>
              )}
              <button
                className={styles.replyButton}
                onClick={() => alert("Reply feature coming soon!")}
              >
                Reply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CancelledProducts;
