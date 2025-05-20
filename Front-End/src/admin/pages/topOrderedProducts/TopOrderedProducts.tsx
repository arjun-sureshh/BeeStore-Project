import React, { useEffect, useState } from "react";
import styles from "./TopOrderedProducts.module.css";
import axios from "axios";
import { togglePageControl } from "../../../redux/toogleSlice";
import { useDispatch } from "react-redux";

interface Product {
  productTitle: string;
  sellerName: string;
  orderCount: number;
  image: string;
}

const TopOrderedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = "http://localhost:5000";
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/booking/top-ordered",
        );
        const data = response.data;
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || "Failed to fetch top products");
        }
      } catch (err) {
        // setError('An error occurred while fetching top products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <h3>Top 5 Ordered Products</h3>
        <div
          onClick={() => dispatch(togglePageControl("AllOrders"))}
          className={styles.viewAll}
        >
          View All
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Title</th>
            <th>Seller</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>
                <img
                  src={
                    `${baseUrl}${product.image}` || "/images/placeholder.png"
                  }
                  alt={product.productTitle}
                  className={styles.productImage}
                />
              </td>
              <td>{product.productTitle}</td>
              <td>{product.sellerName}</td>
              <td>{product.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopOrderedProducts;
