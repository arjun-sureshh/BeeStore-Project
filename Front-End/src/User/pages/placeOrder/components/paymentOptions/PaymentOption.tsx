import React, { useState, useEffect, useRef } from "react";
import styles from "./PaymentOption.module.css";
import axios from "axios";
import { existingUserData } from "../../../../components/types/types";
import Confetti from "react-confetti"; // Import react-confetti
import { gsap } from "gsap"; // Import GSAP for animation
import { useNavigate } from "react-router";

// Custom hook to get window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

interface PaymentOption {
  id: string;
  label: string;
  options?: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
}

interface PaymentOptionsProps {
  amount?: number;
  onPaymentSubmit?: (paymentData: { method: string; details: any }) => void;
  selectedAddressId?: string;
  existingUser?: existingUserData | null;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  amount,
  onPaymentSubmit,
  selectedAddressId,
  existingUser,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [codCharges, setCodCharges] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [captchaText, setCaptchaText] = useState<string>("");
  const [userCaptchaInput, setUserCaptchaInput] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const { width, height } = useWindowSize(); // Use custom hook
  const successMessageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;

  // Generate a random CAPTCHA string
  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  // Initialize CAPTCHA when component mounts or COD is selected
  useEffect(() => {
    if (selectedPayment === "cod") {
      setCaptchaText(generateCaptcha());
      setUserCaptchaInput("");
      setIsCaptchaVerified(false);
    }
  }, [selectedPayment]);

  // Animate success message when orderSuccess is true
  useEffect(() => {
    if (orderSuccess && successMessageRef.current) {
      gsap.fromTo(
        successMessageRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
      );
    }
  }, [orderSuccess]);

  const paymentOptions: PaymentOption[] = [
    {
      id: "upi",
      label: "UPI",
      options: "Pay by any UPI app",
      hasInput: true,
      inputPlaceholder: "Enter UPI ID (e.g., name@upi)",
    },
    {
      id: "card",
      label: "Credit / Debit / ATM Card",
      hasInput: true,
      inputPlaceholder: "Enter Card Number (16 digits)",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      hasInput: true,
      inputPlaceholder: "Enter COD charges (if any)",
    },
  ];

  const handlePaymentSelect = (id: string) => {
    setSelectedPayment(id);
    setUpiId("");
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setCodCharges("");
    setError(null);
    setUserCaptchaInput("");
    setIsCaptchaVerified(false);
  };

  const validateInputs = () => {
    if (
      selectedPayment === "upi" &&
      !upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/)
    ) {
      setError("Invalid UPI ID format (e.g., name@upi)");
      return false;
    }
    if (selectedPayment === "card") {
      if (!cardNumber.match(/^\d{16}$/)) {
        setError("Card number must be 16 digits");
        return false;
      }
      if (!expiryMonth || !expiryYear || !cvv.match(/^\d{3,4}$/)) {
        setError("Invalid expiry date or CVV");
        return false;
      }
    }
    if (selectedPayment === "cod" && codCharges && !codCharges.match(/^\d+$/)) {
      setError("COD charges must be a number");
      return false;
    }
    if (selectedPayment === "cod" && !isCaptchaVerified) {
      setError("Please verify the CAPTCHA");
      return false;
    }
    return true;
  };

  const handleCaptchaVerify = () => {
    if (userCaptchaInput === captchaText) {
      setIsCaptchaVerified(true);
      setError(null);
    } else {
      setIsCaptchaVerified(false);
      setError("Incorrect CAPTCHA. Please try again.");
      setCaptchaText(generateCaptcha());
      setUserCaptchaInput("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    if (!selectedPayment) {
      setError("Please select a payment method");
      return;
    }

    if (!validateInputs()) return;

    const paymentData = {
      method: selectedPayment,
      details:
        selectedPayment === "upi"
          ? { upiId }
          : selectedPayment === "card"
            ? { cardNumber, expiryMonth, expiryYear, cvv }
            : { codCharges: codCharges || "0" },
    };

    if (onPaymentSubmit) {
      onPaymentSubmit(paymentData);
    }

    const bookingID = sessionStorage.getItem("bookingID");
    if (!bookingID) {
      setError("No booking ID found. Please return to cart.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/booking/confirm-order`,
        {
          bookingID,
          addressId: selectedAddressId,
          userId: existingUser?._id,
        },
      );

      if (response.status === 200) {
        console.log("Order confirmed:", response.data);
        setOrderSuccess(true);
        sessionStorage.removeItem("bookingID");
        setTimeout(() => {
          navigate("/");
        }, 3500);
      } else {
        setError("Failed to confirm order. Please try again.");
      }
    } catch (error: any) {
      console.error("Confirm order error:", error);
      setError("Server error while confirming the order.");
    }
  };

  return (
    <div className={styles.paymentContainer}>
      {orderSuccess ? (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={800}
            gravity={0.15}
            initialVelocityY={5}
            colors={["#ff4081", "#2196F3", "#4CAF50", "#FFEB3B"]}
          />
          <div ref={successMessageRef} className={styles.successMessage}>
            <h2>Your Order is Placed!</h2>
            <p>
              Thank you for your purchase. You'll receive a confirmation soon.
            </p>
          </div>
        </>
      ) : (
        <>
          {error && <p className={styles.error}>{error}</p>}
          {paymentOptions.map((option) => (
            <div key={option.id} className={styles.paymentOption}>
              <input
                type="radio"
                id={option.id}
                name="paymentMethod"
                value={option.id}
                checked={selectedPayment === option.id}
                onChange={() => handlePaymentSelect(option.id)}
              />
              <label htmlFor={option.id} className={styles.label}>
                {option.label}
              </label>
              {option.options && selectedPayment === option.id && (
                <p className={styles.subText}>{option.options}</p>
              )}
              {selectedPayment === option.id && option.hasInput && (
                <div className={styles.inputContainer}>
                  {option.id === "card" && (
                    <>
                      <input
                        type="text"
                        placeholder={option.inputPlaceholder}
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className={styles.inputField}
                        maxLength={16}
                      />
                      <div className={styles.expiryContainer}>
                        <select
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          className={styles.selectField}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span>/</span>
                        <select
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          className={styles.selectField}
                        >
                          <option value="">YY</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </option>
                            );
                          })}
                        </select>
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(e.target.value.replace(/\D/g, ""))
                          }
                          className={styles.selectField}
                          maxLength={4}
                        />
                      </div>
                    </>
                  )}
                  {option.id === "upi" && (
                    <input
                      type="text"
                      placeholder={option.inputPlaceholder}
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className={styles.inputField}
                    />
                  )}
                  {option.id === "cod" && (
                    <>
                      <div className={styles.captchaContainer}>
                        <p className={styles.captchaText}>{captchaText}</p>
                        <input
                          type="text"
                          placeholder="Enter CAPTCHA"
                          value={userCaptchaInput}
                          onChange={(e) => setUserCaptchaInput(e.target.value)}
                          className={styles.inputField}
                          disabled={isCaptchaVerified}
                        />
                        <button
                          className={styles.verifyButton}
                          onClick={handleCaptchaVerify}
                          disabled={isCaptchaVerified}
                        >
                          {isCaptchaVerified ? "Verified" : "Verify CAPTCHA"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            className={styles.confirmButton}
            onClick={handleSubmit}
            disabled={selectedPayment === "cod" && !isCaptchaVerified}
          >
            Confirm Order and Pay ₹{amount ? amount.toLocaleString() : "0"}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentOptions;
