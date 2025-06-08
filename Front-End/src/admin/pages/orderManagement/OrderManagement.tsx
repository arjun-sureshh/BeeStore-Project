import React, { useEffect, useState } from "react";
import styles from "./OrderManagement.module.css";
import axios from "axios";

interface VariantDetails {
  _id: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
  productId: { _id: string; sellerId?: { _id: string; sellerName: string } };
  colorId?: { _id?: string; color?: string };
  productDiscription: string;
}

interface CartItem {
  _id: string;
  cartQty: number;
  productvariantId: string;
  bookingID: string;
  cartStatus: number;
  variantDetails: VariantDetails;
  image: string | null;
  status: "Pending" | "Packed" | "Shipped" | "Received";
}

interface Address {
  _id: string;
  mobileNumber: string;
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  addressType: string;
}

interface Order {
  _id: string;
  userId: { _id: string; userName?: string; userEmail?: string };
  addressId: Address;
  amount: string;
  createdAt: string;
  status?: number; // Add status to Order interface
  cartItems: CartItem[];
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/get-order-details?page=${page}&limit=${limit}`,
        );
        console.log(response.data);
        
        const { data, pagination } = response.data;
        const mappedOrders = data.map((order: any) => ({
          ...order,
          status: order.status, // Keep numeric status for booking
          cartItems: order.cartItems.map((item: any) => ({
            ...item,
            status:
              item.cartStatus === 1
                ? "Pending"
                : item.cartStatus === 2.5
                  ? "Packed"
                  : item.cartStatus === 3
                    ? "Shipped"
                    : item.cartStatus === 4
                      ? "Received"
                      : "Pending",
            variantDetails: item.variantDetails || {},
          })),
        }));
        setOrders(mappedOrders);
        setTotalPages(pagination.totalPages);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, limit]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/booking/search-orders-by-product-title?productTitle=${searchTerm}&page=${page}&limit=${limit}`,
      );
      const { data, pagination } = response.data;
      const mappedOrders = data.map((order: any) => ({
        ...order,
        status: order.status, // Keep numeric status for booking
        cartItems: order.cartItems.map((item: any) => ({
          ...item,
          status:
            item.cartStatus === 1
              ? "Pending"
              : item.cartStatus === 2.5
                ? "Packed"
                : item.cartStatus === 3
                  ? "Shipped"
                  : item.cartStatus === 4
                    ? "Received"
                    : "Pending",
          variantDetails: item.variantDetails || {},
        })),
      }));
      setOrders(mappedOrders);
      setTotalPages(pagination.totalPages);
      setPage(1);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setOrders([]);
      }
      console.error("Error searching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    cartItemId: string,
    newStatus: "Pending" | "Packed" | "Shipped" | "Received",
  ) => {
    try {
      const statusMap: Record<string, number> = {
        Pending: 1,
        Packed: 2.5,
        Shipped: 3,
        Received: 4,
      };
      const response = await axios.put(
        "http://localhost:5000/api/booking/update-the-status",
        {
          bookingId: orderId,
          cartId: cartItemId,
          status: statusMap[newStatus],
        },
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: response.data.bookingUpdated
                    ? statusMap[newStatus]
                    : order.status,
                  cartItems: order.cartItems.map((item) =>
                    item._id === cartItemId
                      ? { ...item, status: newStatus }
                      : item,
                  ),
                }
              : order,
          ),
        );
      } else {
        console.error("Failed to update status:", response.data);
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by product title"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className={styles.ordersList}>
        {loading ? (
          <p className={styles.noOrders}>Loading...</p>
        ) : orders.length === 0 && searchTerm ? (
          <p className={styles.noOrders}>No results found for "{searchTerm}"</p>
        ) : orders.length === 0 ? (
          <p className={styles.noOrders}>No orders found</p>
        ) : (
          orders.map((order) =>
            order.cartItems.map((item) => (
              <div
                key={`${order._id}-${item._id}`}
                className={styles.orderItem}
              >
                <div className={styles.productImageWrapper}>
                  {item.image ? (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.variantDetails.productTitle}
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.productImagePlaceholder}></div>
                  )}
                </div>

                <div className={styles.productDetails}>
                  <h3 className={styles.productName}>
                    {item.variantDetails.productTitle}
                  </h3>
                  <p className={styles.productInfo}>
                    Color: {item.variantDetails?.colorId?.color || "N/A"}
                  </p>
                  <p className={styles.productInfo}>Quantity: {item.cartQty}</p>
                  <p className={styles.orderPrice}>
                    ₹{item.variantDetails.sellingPrice}
                  </p>
                  <p className={styles.productInfo}>
                    Description: {item.variantDetails.productDiscription}
                  </p>
                </div>

                <div className={styles.orderStatus}>
                  <p>
                    Status:{" "}
                    <span className={styles[item.status]}>{item.status}</span>
                  </p>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        order._id,
                        item._id,
                        e.target.value as
                          | "Pending"
                          | "Packed"
                          | "Shipped"
                          | "Received",
                      )
                    }
                    className={styles.statusSelect}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Received">Received</option>
                  </select>
                </div>

                <p className={styles.orderInfo}>
                  Order ID: {order._id} | Seller Name:{" "}
                  {item.variantDetails.productId.sellerId?.sellerName} | User
                  Name: {order.userId.userName} | Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()} | Address:{" "}
                  {order.addressId.address}, {order.addressId.city}
                </p>
                <p className={styles.orderInfo}>
                  Booking Status:{" "}
                  {order.status === 1
                    ? "Pending"
                    : order.status === 2.5
                      ? "Packed"
                      : order.status === 3
                        ? "Shipped"
                        : order.status === 4
                          ? "Received"
                          : "Unknown"}
                </p>
              </div>
            )),
          )
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || loading}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;
