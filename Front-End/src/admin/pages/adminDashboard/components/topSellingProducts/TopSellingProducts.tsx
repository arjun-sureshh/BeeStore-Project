import React from "react";
import styles from "./TopSellingProducts.module.css"; // Import the CSS Module

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  seller: string;
  orders: number;
  status: "InProgress" | "Paused" | "Cancelled"; // ✅ Restricting the type
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.tableContainer}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Seller Name</th>
            <th>Orders</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className={styles.productInfo}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <p className={styles.category}>{product.category}</p>
                  </div>
                </div>
              </td>
              <td>{product.seller}</td>
              <td>{product.orders}</td>
              <td>
                <span
                  className={`${styles.status} ${styles[product.status.toLowerCase()]}`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
