import React, { useEffect, useState } from "react";
import styles from "./ContentArea.module.css";
import TopSmallBox from "../smallBox/TopSmallBox";
import { PiPulseLight, PiShoppingBagOpenDuotone } from "react-icons/pi";
import { BsCart2 } from "react-icons/bs";
// import TopOrderedProducts from '../topOrderedProducts/TopOrderedProducts';
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import District from "../../../district/District";
import Category from "../../../category/Category";
import Color from "../../../color/Color";
import Brand from "../../../brand/Brand";
import PaymentMethod from "../../../paymentMethod/PaymentMethod";
import PolicyMethod from "../../../policyMethos/PolicyMethod";
import AdminProfile from "../../../adminProfile/AdminProfile";
import AdminEditProfile from "../../../adminEditProfile/AdminEditProfile";
import AdminChangePassword from "../../../adminchangePassword/AdminChangePassword";
import SizeType from "../../../sizeType/SizeType";
import SellerQC from "../../../qcSection/sellerQC/SellerQC";
import ApprovedSellers from "../../../approved/approvedSellers/ApprovedSellers";
import RejectedSellers from "../../../rejected/rejectedSeller/RejectedSeller";
import ProductQC from "../../../qcSection/productQC/ProductQC";
import ApprovedProduct from "../../../approved/approvedProducts/ApprovedProducts";
import RejectedProduct from "../../../rejected/rejectedProduct/RejectedProduct";
import OrderManagement from "../../../orderManagement/OrderManagement";
import DeliveredOrders from "../../../deliveredOrders/DeliveredOrders";
import TopOrderedProducts from "../../../topOrderedProducts/TopOrderedProducts";
import axios from "axios";
import AllOrders from "../../../allOrders/AllOrders";

const ContentArea: React.FC = () => {
  const openPage = useSelector(
    (state: RootState) => state.toggle.openPage || {},
  );
  const [totalIncome, setTotalIncome] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/booking/total-income",
        );
        const data = await response.data;
        console.log(response);

        if (data.success) {
          setTotalIncome(data.data.toFixed(2) || 0);
        } else {
          setError(data.message || "Failed to fetch total income");
        }
      } catch (err) {
        // setError('An error occurred while fetching total income');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalIncome();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.body}>
      {openPage["District"] ? (
        <div className={styles.renderComponent}>
          <District />
        </div>
      ) : openPage["Categories"] ? (
        <div className={styles.renderComponent}>
          <Category />
        </div>
      ) : openPage["Color"] ? (
        <div className={styles.renderComponent}>
          <Color />
        </div>
      ) : openPage["Brand"] ? (
        <div className={styles.renderComponent}>
          <Brand />
        </div>
      ) : openPage["Payment"] ? (
        <div className={styles.renderComponent}>
          <PaymentMethod />
        </div>
      ) : openPage["Policy"] ? (
        <div className={styles.renderComponent}>
          <PolicyMethod />
        </div>
      ) : openPage["AdminProfile"] ? (
        <div className={styles.renderComponent}>
          <AdminProfile />
        </div>
      ) : openPage["EditProfile"] ? (
        <div className={styles.renderComponent}>
          <AdminEditProfile />
        </div>
      ) : openPage["ChangePassword"] ? (
        <div className={styles.renderComponent}>
          <AdminChangePassword />
        </div>
      ) : openPage["Size"] ? (
        <div className={styles.renderComponent}>
          <SizeType />
        </div>
      ) : openPage["SellerQC"] ? (
        <div className={styles.renderComponent}>
          <SellerQC />
        </div>
      ) : openPage["ApprovedSeller"] ? (
        <div className={styles.renderComponent}>
          <ApprovedSellers />
        </div>
      ) : openPage["RejectedSeller"] ? (
        <div className={styles.renderComponent}>
          <RejectedSellers />
        </div>
      ) : openPage["ProductQC"] ? (
        <div className={styles.renderComponent}>
          <ProductQC />
        </div>
      ) : openPage["ApprovedProducts"] ? (
        <div className={styles.renderComponent}>
          <ApprovedProduct />
        </div>
      ) : openPage["RejectedProducts"] ? (
        <div className={styles.renderComponent}>
          <RejectedProduct />
        </div>
      ) : openPage["OrderManagement"] ? (
        <div className={styles.renderComponent}>
          <OrderManagement />
        </div>
      ) : openPage["DeliveredOrders"] ? (
        <div className={styles.renderComponent}>
          <DeliveredOrders />
        </div>
      ) : openPage["AllOrders"] ? (
        <div className={styles.renderComponent}>
          <AllOrders />
        </div>
      ) : (
        <>
          <div className={styles.container}>
            <TopSmallBox
              title="Income"
              price={loading ? "Loading..." : `$${totalIncome}`}
              per="6.25%"
              message="Since last week"
              Icon={PiShoppingBagOpenDuotone}
            />
            <TopSmallBox
              title="Orders"
              price="3.282"
              per="-4.65%"
              message="Since last week"
              Icon={BsCart2}
            />
            <TopSmallBox
              title="Activity"
              price="19.312"
              per="8.35%"
              message="Since last week"
              Icon={PiPulseLight}
            />
          </div>
          <div className={styles.topSelllingProducts}>
            <TopOrderedProducts />
          </div>
        </>
      )}
    </div>
  );
};

export default ContentArea;
