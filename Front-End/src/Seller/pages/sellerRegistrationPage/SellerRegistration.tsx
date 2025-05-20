import React, { useEffect } from "react";
import styles from "./sellerRegistration.module.css";
import SellerRegFirstPage from "./components/sellerRegistrationFirstPage/SellerRegFirstPage";
import SellerRegSecondPage from "./components/sellerRegSecondPage/SellerRegSecondPage";
import SellerRegThirdPage from "./components/sellerRegThirdPage/SellerRegThirdPage";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toggleSellerRegistrationStage } from "../../../redux/toogleSlice";
import { IoIosCheckmarkCircle } from "react-icons/io";

const SellerRegistration: React.FC = () => {
  const dispatch = useDispatch();

  const sellerRegistrationStage = useSelector(
    (state: RootState) => state.toggle.sellerRegistrationStage,
  );
  const sellerId = useSelector((state: RootState) => state.toggle.sellerId);

  useEffect(() => {
    if (!sellerId) return;
    console.log("seller id in the main:", sellerId);

    const fetchProductStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/${sellerId}`,
        );
        dispatch(
          toggleSellerRegistrationStage(response.data.data.ListingStatus),
        );
      } catch (error: any) {
        console.error(
          "Error fetching product status:",
          error.response?.data || error.message,
        );
      }
    };

    fetchProductStatus();
  }, [sellerId]);

  return (
    <div className={styles.whole}>
      <div className={styles.icon}>
        <div className={styles.firsticon}>
          <div
            className={`${sellerRegistrationStage > 1 ? styles.ticktrue : styles.tick}`}
          >
            <IoIosCheckmarkCircle />
          </div>
          <div className={styles.tickk}>EMAIL ID & GST</div>
        </div>
        <div className={styles.seccon}>
          <div
            className={`${sellerRegistrationStage > 2 ? styles.ticktrue : styles.tick}`}
          >
            <IoIosCheckmarkCircle />
          </div>
          <div className={styles.tickk}>PASSWORD CREATION </div>
        </div>
        <div className={styles.seccon}>
          <div
            className={`${sellerRegistrationStage > 3 ? styles.ticktrue : styles.tick}`}
          >
            <IoIosCheckmarkCircle />
          </div>
          <div className={styles.tickk}>ONBOARDING DASHBOARD </div>
        </div>
      </div>
      {sellerRegistrationStage == 1 && <SellerRegFirstPage />}
      {sellerRegistrationStage == 2 && <SellerRegSecondPage />}
      {sellerRegistrationStage == 3 && <SellerRegThirdPage />}
    </div>
  );
};

export default SellerRegistration;
