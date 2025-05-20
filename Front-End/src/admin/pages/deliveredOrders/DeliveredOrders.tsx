import React, { useEffect, useState } from "react";
import styles from "./DeliveredOrders.module.css";
import axios from "axios";
// import { RootState } from '../../../../../redux/store';

interface Order {
  _id: string;
  amount: string;
  userId: string;
  addressId: string;
  createdAt: string;
}

const DeliveredOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/booking/delivered",
        );
        const data = await response.data;
        if (data.success) {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.body}>
      <h2>Delivered Orders</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Amount</th>
            <th>User ID</th>
            <th>Address ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>${parseFloat(order.amount).toFixed(2)}</td>
              <td>{order.userId}</td>
              <td>{order.addressId}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveredOrders;
