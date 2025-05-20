import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SellerHomePage.module.css";
import UpdatBox from "./components/updateBox/UpdatBox";

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
  createdAt: string;
}

interface ActiveListing {
  productId: string;
  variants: {
    _id: string;
    productTitle: string;
    sellingPrice: number;
    mrp: number;
    gallery: Gallery[];
  }[];
}

interface DashboardStats {
  unitsSold: number;
  sales: number;
  newOrders: number;
  activeListings: number;
  soldItems: CartItem[];
  newOrderDetails: CartItem[];
  activeListingDetails: ActiveListing[];
}

const SellerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";
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
  const [stats, setStats] = useState<DashboardStats>({
    unitsSold: 0,
    sales: 0,
    newOrders: 0,
    activeListings: 0,
    soldItems: [],
    newOrderDetails: [],
    activeListingDetails: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    newOrders: boolean;
    activeListings: boolean;
    unitsSold: boolean;
  }>({
    newOrders: false,
    activeListings: false,
    unitsSold: false,
  });

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const token = sessionStorage.getItem("seller");
      if (!token) {
        navigate("/Seller");
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/api/Login`, {
          headers: {
            "x-auth-token": token,
          },
        });
        setSellerData(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
        setError("Failed to fetch seller details");
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  useEffect(() => {
    if (!sellerData._id) return;

    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/cart/dashboard-stats/${sellerData._id}`, // Updated endpoint to match previous API
        );
        setStats(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to fetch dashboard stats");
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [sellerData._id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.greeting}>
        Hello, {sellerData.sellerName || "Seller"}!
      </div>
      <div className={styles.yourDashboard}>Your Dashboard</div>
      <div className={styles.updatesSection}>
        <UpdatBox numbers={stats.unitsSold} headName="Units Sold" />
        <UpdatBox numbers={stats.sales} headName="Sales" />
        <UpdatBox numbers={stats.newOrders} headName="New Orders" />
        <UpdatBox numbers={stats.activeListings} headName="Active Listings" />
      </div>

      {/* New Orders Section */}
      <div className={styles.detailsSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("newOrders")}
        >
          New Orders ({stats.newOrders})
        </div>
        {expandedSections.newOrders && (
          <div className={styles.detailsContent}>
            {stats.newOrderDetails.length === 0 ? (
              <p>No new orders found.</p>
            ) : (
              <div className={styles.detailsGrid}>
                {stats.newOrderDetails.map((order) => (
                  <div key={order._id} className={styles.detailCard}>
                    <img
                      src={
                        order.gallery[0]?.photos
                          ? `${baseUrl}${order.gallery[0].photos}`
                          : "/placeholder-image.jpg"
                      }
                      alt={order.productvariantId.productTitle}
                      className={styles.detailImage}
                    />
                    <div className={styles.detailInfo}>
                      <h3>{order.productvariantId.productTitle}</h3>
                      <p>Quantity: {order.cartQty}</p>
                      <p>Price: ₹{order.productvariantId.sellingPrice}</p>
                      <p>
                        Ordered On:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Listings Section (Table Format) */}
      <div className={styles.detailsSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("activeListings")}
        >
          Active Listings ({stats.activeListings})
        </div>
        {expandedSections.activeListings && (
          <div className={styles.detailsContent}>
            {stats.activeListingDetails.length === 0 ? (
              <p>No active listings found.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.listingsTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Selling Price</th>
                      <th>MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.activeListingDetails.map((listing) =>
                      listing.variants.map((variant) => (
                        <tr key={variant._id}>
                          <td>
                            <img
                              src={
                                variant.gallery[0]?.photos
                                  ? `${baseUrl}${variant.gallery[0].photos}`
                                  : "/placeholder-image.jpg"
                              }
                              alt={variant.productTitle}
                              className={styles.tableImage}
                            />
                          </td>
                          <td>{variant.productTitle}</td>
                          <td>₹{variant.sellingPrice}</td>
                          <td>₹{variant.mrp}</td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Units Sold Section */}
      <div className={styles.detailsSection}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("unitsSold")}
        >
          Units Sold ({stats.unitsSold})
        </div>
        {expandedSections.unitsSold && (
          <div className={styles.detailsContent}>
            {stats.soldItems.length === 0 ? (
              <p>No units sold yet.</p>
            ) : (
              <div className={styles.detailsGrid}>
                {stats.soldItems.map((item) => (
                  <div key={item._id} className={styles.detailCard}>
                    <img
                      src={
                        item.gallery[0]?.photos
                          ? `${baseUrl}${item.gallery[0].photos}`
                          : "/placeholder-image.jpg"
                      }
                      alt={item.productvariantId.productTitle}
                      className={styles.detailImage}
                    />
                    <div className={styles.detailInfo}>
                      <h3>{item.productvariantId.productTitle}</h3>
                      <p>Quantity: {item.cartQty}</p>
                      <p>Price: ₹{item.productvariantId.sellingPrice}</p>
                      <p>
                        Delivered On:{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerHomePage;
