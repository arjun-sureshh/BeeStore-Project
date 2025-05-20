import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import axios from "axios";
import FeedbackForm from "../feedback/FeeddBack";

interface CartItem {
  _id: string;
  productId: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
  color: string;
  description: string;
  quantity: number;
  image: string | null;
  cartStatus: number;
  updatedAt: string;
}

interface Order {
  _id: string;
  amount: string;
  createdAt: string;
  status: number;
  cartItems: CartItem[];
}

interface UserData {
  _id?: string;
}

interface RatingPageState {
  productId: string;
  cartId: string;
  openPage: boolean;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isRatingPage, setIsRatingPage] = useState<RatingPageState>({
    productId: "",
    cartId: "",
    openPage: false,
  });

  const statusOptions = [
    "Pending",
    "Packed",
    "Shipped",
    "Received",
    "Cancelled",
  ];
  const timeFrameOptions = [
    "Last 30 days",
    "2024",
    "2023",
    "2022",
    "2021",
    "Older",
  ];
  const IMAGE_BASE_URL = "http://localhost:5000";

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = sessionStorage.getItem("user");
      if (!token) {
        console.log("No user signed in");
        setUserData(null);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: { "x-auth-token": token },
        });
        setUserData(response.data);
      } catch (error: any) {
        console.error(
          "Error fetching user details:",
          error.response?.data || error.message,
        );
        setUserData(null);
        sessionStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!userData?._id) return;

      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/booking/order-details",
          {
            userId: userData._id,
          },
        );
        setOrders(response.data.data);
        console.log("Order details:", response.data.data);
      } catch (error: any) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [userData]);

  // Handle search

  const handleSearch = async () => {
    if (!userData?._id) {
      console.error("User ID is missing");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (!searchTerm) {
        // Fetch all orders for the user
        response = await axios.post(
          "http://localhost:5000/api/booking/order-details",
          {
            userId: userData._id,
          },
        );
      } else {
        console.log(searchTerm, userData._id);

        // Search orders by product title and user ID
        response = await axios.post(
          `http://localhost:5000/api/booking/search-orders`,
          {
            productTitle: searchTerm,
            userId: userData._id,
          },
        );
      }

      setOrders(response.data.data);
    } catch (error: any) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message,
      );
      // Optionally set an error state to display to the user
      // setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  // Handle cancel cart item
  const handleCancelCartItem = async (
    bookingId: string,
    cartItemId: string,
  ) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/booking/cancel-cart-item",
        {
          bookingId,
          cartId: cartItemId,
        },
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === bookingId
              ? {
                  ...order,
                  status: response.data.bookingUpdated ? -1 : order.status,
                  cartItems: order.cartItems.map((item) =>
                    item._id === cartItemId
                      ? { ...item, cartStatus: -1 }
                      : item,
                  ),
                }
              : order,
          ),
        );
      }
    } catch (error: any) {
      console.error(
        "Error cancelling cart item:",
        error.response?.data || error.message,
      );
      alert(
        "Failed to cancel item: " +
          (error.response?.data?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm received
  const handleConfirmReceived = async (
    bookingId: string,
    cartItemId: string,
  ) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/booking/update-the-status",
        {
          bookingId,
          cartId: cartItemId,
          status: 4,
        },
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === bookingId
              ? {
                  ...order,
                  status: response.data.bookingUpdated ? 4 : order.status,
                  cartItems: order.cartItems.map((item) =>
                    item._id === cartItemId ? { ...item, cartStatus: 4 } : item,
                  ),
                }
              : order,
          ),
        );
      }
    } catch (error: any) {
      console.error(
        "Error confirming received:",
        error.response?.data || error.message,
      );
      alert(
        "Failed to confirm received: " +
          (error.response?.data?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate estimated delivery date
  const getEstimatedDeliveryDate = (updatedAt: string): string => {
    const updatedDate = new Date(updatedAt);
    updatedDate.setDate(updatedDate.getDate() + 5);
    return updatedDate.toLocaleString();
  };

  // Map cartStatus to status text
  const getStatusText = (cartStatus: number): string => {
    switch (cartStatus) {
      case 1:
        return "Pending";
      case 2.5:
        return "Packed";
      case 3:
        return "Shipped";
      case 4:
        return "Received";
      case -1:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    const statusMatch =
      selectedStatuses.length === 0 ||
      order.cartItems.some((item) =>
        selectedStatuses.includes(getStatusText(item.cartStatus)),
      );

    let timeFrameMatch = true;
    if (selectedTimeFrame) {
      if (selectedTimeFrame === "Last 30 days") {
        timeFrameMatch =
          now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      } else if (selectedTimeFrame === "Older") {
        timeFrameMatch = orderDate.getFullYear() < 2021;
      } else {
        timeFrameMatch =
          orderDate.getFullYear().toString() === selectedTimeFrame;
      }
    }

    return statusMatch && timeFrameMatch;
  });

  // Open feedback form
  const giveRateing = (productId: string, cartId: string) => {
    setIsRatingPage({
      productId,
      cartId,
      openPage: true,
    });
  };

  // Close feedback form
  const closeFeedbackForm = () => {
    setIsRatingPage({
      productId: "",
      cartId: "",
      openPage: false,
    });
  };

  return (
    <div className={styles.container}>
      {/* Feedback Form Modal */}
      {isRatingPage.openPage && userData?._id && (
        <FeedbackForm
          cartId={isRatingPage.cartId}
          productId={isRatingPage.productId}
          userId={userData._id}
          onClose={closeFeedbackForm}
        />
      )}

      {/* Filters Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.filtersTitle}>Filters</h2>
        <div className={styles.orderStatus}>
          <h3 className={styles.filterSectionTitle}>ORDER STATUS</h3>
          {statusOptions.map((status) => (
            <div key={status} className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id={status}
                className={styles.checkbox}
                checked={selectedStatuses.includes(status)}
                onChange={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes(status)
                      ? prev.filter((s) => s !== status)
                      : [...prev, status],
                  )
                }
                disabled={loading}
              />
              <label htmlFor={status} className={styles.checkboxLabel}>
                {status}
              </label>
            </div>
          ))}
        </div>
        <div className={styles.orderTime}>
          <h3 className={styles.filterSectionTitle}>ORDER TIME</h3>
          {timeFrameOptions.map((timeFrame) => (
            <div key={timeFrame} className={styles.filterRadio}>
              <input
                type="radio"
                id={timeFrame}
                name="timeFrame"
                className={styles.radio}
                checked={selectedTimeFrame === timeFrame}
                onChange={() => setSelectedTimeFrame(timeFrame)}
                disabled={loading}
              />
              <label htmlFor={timeFrame} className={styles.radioLabel}>
                {timeFrame}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className={styles.ordersList}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search your orders here"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Orders"}
          </button>
        </div>

        <div className={styles.orderContainer}>
          {loading ? (
            <p>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            filteredOrders.flatMap((order) =>
              order.cartItems.map((item) => {
                const statusText = getStatusText(item.cartStatus);
                return (
                  <div
                    key={`${order._id}-${item._id}`}
                    className={styles.orderItem}
                  >
                    {item.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}${item.image}`}
                        alt={item.productTitle}
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    ) : (
                      <div className={styles.productImagePlaceholder}></div>
                    )}
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>
                        {item.productTitle}
                      </h3>
                      <p className={styles.productColor}>Color: {item.color}</p>
                      <p className={styles.productDescription}>
                        {item.description}
                      </p>
                      <p className={styles.productQuantity}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className={styles.orderStatusDetails}>
                      <p className={styles.orderPrice}>₹{item.sellingPrice}</p>
                      <p
                        className={`${styles.orderStatus} ${
                          item.cartStatus === 1
                            ? styles.statusPending
                            : item.cartStatus === 2.5
                              ? styles.statusPacked
                              : item.cartStatus === 3
                                ? styles.statusShipped
                                : item.cartStatus === 4
                                  ? styles.statusReceived
                                  : item.cartStatus === -1
                                    ? styles.statusCancelled
                                    : styles.statusUnknown
                        }`}
                      >
                        ● {statusText}
                      </p>
                      <p className={styles.statusMessage}>
                        {item.cartStatus === 1
                          ? "Your order has been placed"
                          : item.cartStatus === 2.5
                            ? "Your item has been packed"
                            : item.cartStatus === 3
                              ? `Expected delivery by ${getEstimatedDeliveryDate(item.updatedAt)}`
                              : item.cartStatus === 4
                                ? `Received on ${new Date(item.updatedAt).toLocaleString()}`
                                : item.cartStatus === -1
                                  ? "Your item has been cancelled"
                                  : "Status unavailable"}
                      </p>
                      {(item.cartStatus === 1 || item.cartStatus === 2.5) && (
                        <button
                          className={styles.cancelButton}
                          onClick={() =>
                            handleCancelCartItem(order._id, item._id)
                          }
                          disabled={loading}
                        >
                          Cancel Item
                        </button>
                      )}
                      {item.cartStatus === 3 && (
                        <button
                          className={styles.confirmButton}
                          onClick={() =>
                            handleConfirmReceived(order._id, item._id)
                          }
                          disabled={loading}
                        >
                          Confirm Received
                        </button>
                      )}
                      {item.cartStatus === 4 && (
                        <button
                          className={styles.reviewButton}
                          onClick={() => giveRateing(item.productId, item._id)}
                          disabled={loading}
                        >
                          Rate & Review Product
                        </button>
                      )}
                    </div>
                  </div>
                );
              }),
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
