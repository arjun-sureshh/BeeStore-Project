// ListingProduct.tsx
import React from "react";
import styles from "./ListingProduct.module.css";
import ProductShow from "./components/productShow/ProductShow";
import { existingUserData } from "../../../../components/types/types";

// Define the product type based on your API response
export interface Product {
  productId: string;
  productVariantId?: string;
  productTitle: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  brandName?: string;
  sellerName?: string;
  topcategoryId?: string;
  color?: string;
  avgRating?: number; // Add avgRating
  ratingCount?: number; // Add ratingCount
}

export interface ApiResponse {
  categoryId: string;
  categoryName: string;
  productCount: number;
  products: Product[];
}

interface ListingProductProps {
  error: string | null;
  loading: boolean;
  products: Product[];
  existingUserData?: existingUserData | null;
}

const ListingProduct: React.FC<ListingProductProps> = ({
  products,
  error,
  loading,
  existingUserData,
}) => {
  if (loading) {
    return <div className={styles.body}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.body}>Error: {error}</div>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.productsRow}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductShow
              existingUserData={existingUserData && existingUserData}
              key={product.productId}
              productId={product.productId}
              productVariantId={product.productVariantId}
              productTitle={product.productTitle}
              sellingPrice={product.sellingPrice}
              mrp={product.mrp}
              image={product.image}
              brandName={product.brandName}
              sellerName={product.sellerName}
              productColor={product.color}
              avgRating={product.avgRating}
              ratingCount={product.ratingCount}
            />
          ))
        ) : (
          <div>No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ListingProduct;
