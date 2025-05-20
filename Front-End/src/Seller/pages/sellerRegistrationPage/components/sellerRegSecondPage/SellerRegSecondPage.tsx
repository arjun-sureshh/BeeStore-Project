import React, { useRef, useState } from "react";
import styles from "./SellerRegSecondPage.module.css";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleSellerId } from "../../../../../redux/toogleSlice";
import axios from "axios";
import { RootState } from "../../../../../redux/store";

interface frontEndErrorProps {
  name: string;
  displayName: string;
}

const SellerRegSecondPage: React.FC = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state: RootState) => state.toggle.sellerId);
  const [name, setName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [frontEndError, setFrontEndError] = useState<frontEndErrorProps>({
    name: "",
    displayName: "",
  });

  //useref
  const nameRef = useRef<HTMLInputElement | null>(null);
  const displayNameRef = useRef<HTMLInputElement | null>(null);

  // handle register
  const handleRegister = async () => {
    if (!name) {
      setFrontEndError({
        ...frontEndError,
        name: "Please enter your Full Name!",
      });
      nameRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        name: "",
      }));
    }

    if (!displayName) {
      setFrontEndError({
        ...frontEndError,
        displayName: "Please enter your Full Name!",
      });
      displayNameRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        displayName: "",
      }));
    }

    const data = {
      sellerName: name,
      sellerDisplayName: displayName,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/seller/updateName/${sellerId}`,
        data,
      );
      console.log(response.data);
      const seller_id = response.data.data._id;
      console.log("sellerid:", seller_id);

      dispatch(toggleSellerId(""));
      setTimeout(() => dispatch(toggleSellerId(seller_id)), 0); // Reinsert after a short delay

      setFrontEndError({
        name: "",
        displayName: "",
      });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.message); // Update error state
      } else {
        console.log("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.full}>
      <div className={styles.wrapper}>
        <div className={styles.verification}>Set up your seller profile</div>
        <div className={styles.almost}>Just a few more details...</div>
        <div className={styles.weneed}>
          Enter your full name and a display name for your seller account. You
          can update these later if needed.
        </div>

        <div className={styles.inp}>
          <div
            className={`${styles.input}  ${frontEndError.name ? styles.borderRed : ""}`}
          >
            <input
              type="text"
              placeholder="Enter Your Full Name"
              onChange={(e) => setName(e.target.value)}
              ref={nameRef}
            />
          </div>
          {frontEndError.name && (
            <div className={styles.errorMsg}>
              <p>{frontEndError.name}</p>
            </div>
          )}
        </div>
        <div className={styles.inp}>
          <div
            className={`${styles.input}  ${frontEndError.displayName ? styles.borderRed : ""}`}
          >
            <input
              type="text"
              placeholder="Enter Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
              ref={displayNameRef}
            />
          </div>
          {frontEndError.displayName && (
            <div className={styles.errorMsg}>
              <p>{frontEndError.displayName}</p>
            </div>
          )}
        </div>
        <div className={styles.registerbtn} onClick={handleRegister}>
          Continue <FaArrowRight />
        </div>
      </div>
    </div>
  );
};

export default SellerRegSecondPage;
