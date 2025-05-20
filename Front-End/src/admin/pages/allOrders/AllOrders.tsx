import React, { useEffect, useState } from "react";
import styles from "./AllOrders.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

interface CartItem {
  cartId: string;
  productId: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
  color: string;
  description: string;
  quantity: number;
  cartStatus: number;
  sellerName: string;
  image: string | null;
}

interface Address {
  mobileNumber: string;
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  addressType: string;
}

interface User {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  amount: string;
  user: User;
  address: Address;
  createdAt: string;
  status: number;
  cartItems: CartItem[];
}

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const baseUrl = "http://localhost:5000";
  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/booking/delivered",
        );
        const data = await response.data;
        if (response.data.success) {
          setOrders(data.data);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredOrders();
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.body}>
      <h2>All Delivered Orders</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className={styles.orderRow}>
                  <td>{order._id}</td>
                  <td>
                    {order.user.name} <br />
                    <small>{order.user.email}</small>
                  </td>
                  <td>
                    {order.address.fullName} <br />
                    {order.address.address}, {order.address.city},{" "}
                    {order.address.pincode} <br />
                    {order.address.mobileNumber} ({order.address.addressType})
                  </td>
                  <td>${parseFloat(order.amount).toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.expandButton}
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      {expandedOrders[order._id] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrders[order._id] && (
                  <tr className={styles.cartItemsRow}>
                    <td colSpan={6}>
                      <div className={styles.cartItems}>
                        <h4>Cart Items</h4>
                        <table className={styles.cartTable}>
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Product</th>
                              <th>Seller</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Color</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.cartItems.map((item) => (
                              <tr key={item.cartId}>
                                <td>
                                  <img
                                    src={
                                      `${baseUrl}${item.image}` ||
                                      "/images/placeholder.png"
                                    }
                                    alt={item.productTitle}
                                    className={styles.productImage}
                                  />
                                </td>
                                <td>
                                  {item.productTitle} <br />
                                  <small>{item.description}</small>
                                </td>
                                <td>{item.sellerName}</td>
                                <td>{item.quantity}</td>
                                <td>${item.sellingPrice.toFixed(2)}</td>
                                <td>{item.color}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
