import React from "react";
import styles from "./CartTotalPrice.module.css";
import BodyName from "./components/bodydetails/BodyName";
import { MdSecurity } from "react-icons/md";

interface CartItem {
  cart_Id?: string;
  cartQty?: number;
  productvariantId?: string;
  mrp?: number;
  sellingPrice?: number;
  sellerName?: string;
  image?: string;
  specification?: string;
  createdAt?: string;
  updatedAt?: string;
  bookingAmount?: number;
  productTitle?: string;
  productId?: string;
  minimumorder?: number;
}

interface CartTotalPriceProps {
  cartItems: CartItem[];
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
}

const CartTotalPrice: React.FC<CartTotalPriceProps> = ({
  cartItems,
  setTotalPrice,
}) => {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.mrp || 0) * (item.cartQty || 1),
    0,
  );
  const discount = cartItems.reduce(
    (sum, item) =>
      sum + ((item.mrp || 0) - (item.sellingPrice || 0)) * (item.cartQty || 1),
    0,
  );
  const totalSellingPrice = cartItems.reduce(
    (sum, item) => sum + (item.sellingPrice || 0) * (item.cartQty || 1),
    0,
  );
  const platformFee = totalSellingPrice * 0.01;
  const deliveryCharges = 0;
  const finalTotal = totalPrice - discount + platformFee + deliveryCharges;
  setTotalPrice(finalTotal);

  return (
    <div>
      <div className={styles.body}>
        <div className={styles.headName}>Price Details</div>
        <div className={styles.priceDetails}>
          <BodyName
            headName="Price"
            itemsNo={cartItems.length}
            price={totalPrice.toFixed(2)}
          />
          <BodyName
            headName="Discount"
            itemsNo={null}
            price={discount.toFixed(2)}
          />
          <BodyName
            headName="Platform Fee"
            itemsNo={null}
            price={platformFee.toFixed(2)}
          />
          <BodyName
            headName="Delivery Charges"
            itemsNo={null}
            price={deliveryCharges.toFixed(2)}
          />
        </div>
        <div className={styles.totalAmountSection}>
          <div className={styles.totalAmount}>Total Amount</div>
          <div className={styles.totalPrice}>₹{finalTotal.toFixed(2)}</div>
        </div>
        <div className={styles.savePrice}>
          You will save ₹{discount.toFixed(2)} on this order
        </div>
      </div>
      <div className={styles.securityMessage}>
        <div className={styles.icons}>
          <MdSecurity />
        </div>
        <div className={styles.message}>
          Safe and Secure Payments. Easy returns. 100% Authentic products.
        </div>
      </div>
    </div>
  );
};

export default CartTotalPrice;
