import React, { useState } from "react";
import styles from "./SellerLogin.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface LoginPopupProps {
  onClose: () => void;
}

const SellerLogin: React.FC<LoginPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<{ email: boolean; password: boolean }>(
    {
      email: true,
      password: true,
    },
  );
  const [errorMessages, setErrorMessages] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailExists, setEmailExists] = useState(false); // New state to track if email exists
  const navigate = useNavigate();

  // Handle input changes and validate
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      // Check if email exists when it changes
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/seller/check-email`,
            { email: value },
          );
          setEmailExists(response.data.exists); // Assuming backend returns { exists: true/false }
          setErrorMessages((prev) => ({ ...prev, email: "" }));
        } catch (error: any) {
          setEmailExists(false);
          setErrorMessages((prev) => ({
            ...prev,
            email: "Error checking email. Please try again.",
          }));
        }
      } else {
        setEmailExists(false);
      }
    }
    if (name === "password") setPassword(value);
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let fieldValid = true;
    let errorMessage = "";
    switch (name) {
      case "email":
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";
        errorMessage = fieldValid ? "" : "Please enter a valid email address";
        break;
      case "password":
        fieldValid = value.length >= 8 || value === "";
        errorMessage = fieldValid
          ? ""
          : "Password must be at least 8 characters";
        break;
      default:
        break;
    }
    setIsValid((prev) => ({ ...prev, [name]: fieldValid }));
    setErrorMessages((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      isValid.email &&
      isValid.password
    );
  };

  // Handle login submission
  const handleLogin = async () => {
    try {
      const data = { email, password };
      const response = await axios.post(
        `http://localhost:5000/api/Login`,
        data,
      );
      if (response.data.userType === "seller") {
        sessionStorage.setItem("seller", response.data.token);
        navigate("/Seller");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.data?.error ||
          error.response.data?.message ||
          "An error occurred";
        if (error.response.status === 400) {
          if (message.includes("password")) {
            setErrorMessages((prev) => ({
              ...prev,
              password:
                "The password you entered is incorrect. Please try again.",
            }));
          } else if (message.includes("user") || message.includes("account")) {
            setErrorMessages((prev) => ({
              ...prev,
              email: "We couldn’t find an account with this email.",
            }));
            setEmailExists(false); // Update emailExists if account not found
          } else {
            setErrorMessages((prev) => ({ ...prev, email: message }));
          }
        } else if (error.response.status === 403) {
          setErrorMessages((prev) => ({
            ...prev,
            email:
              "Your account has not been verified by the admin yet. Please wait for verification before logging in and selling products.",
          }));
        } else {
          setErrorMessages((prev) => ({
            ...prev,
            email: "Something went wrong. Please try again.",
          }));
        }
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          email: "Network error. Please check your connection.",
        }));
      }
    }
  };

  // Forgot Password handlers
  const handleForgotPasswordClick = () => {
    if (emailExists) {
      setForgotEmail(email); // Pre-fill with login email
      setShowForgotPassword(true);
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`http://localhost:5000/api/seller/send-otp`, {
        sellerEmail: forgotEmail,
      });
      setOtpSent(true);
      alert("OTP sent to your email!");
      setErrorMessages((prev) => ({ ...prev, email: "" }));
    } catch (error: any) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "Failed to send OTP. Please try again.",
      }));
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "Please enter a valid OTP",
      }));
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/seller/verify-otp`,
        {
          sellerEmail: forgotEmail,
          otp,
        },
      );
      if (response.data.success) {
        setOtpVerified(true);
        console.log(response.data);

        alert("OTP Verified!");
        setErrorMessages((prev) => ({ ...prev, email: "" }));
      }
    } catch (error: any) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "Invalid OTP. Please try again.",
      }));
    }
  };

  const handleResetPassword = async () => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      setErrorMessages((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessages((prev) => ({
        ...prev,
        password: "",
        confirmPassword:
          "Oops! Your confirm password doesn't match the new password.",
      }));
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/seller/reset-password`, {
        email: forgotEmail,
        password: newPassword,
      });
      setShowForgotPassword(false);
      setOtpSent(false);
      setOtpVerified(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      alert(
        "Password reset successfully! Please login with your new password.",
      );
    } catch (error: any) {
      setErrorMessages((prev) => ({
        ...prev,
        password: "Failed to reset password. Please try again.",
      }));
    }
  };

  return (
    <div className={styles.overlay}>
      {!showForgotPassword ? (
        <div className={styles.popup}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
          <h2 className={styles.title}>Login</h2>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`${styles.input} ${!isValid.email || errorMessages.email ? styles.inputError : ""}`}
              value={email}
              onChange={handleInputChange}
            />
            {(!isValid.email || errorMessages.email) && email && (
              <span className={styles.errorMessage}>
                {errorMessages.email || "Please enter a valid email address"}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`${styles.input} ${!isValid.password || errorMessages.password ? styles.inputError : ""}`}
              value={password}
              onChange={handleInputChange}
            />
            {(!isValid.password || errorMessages.password) && password && (
              <span className={styles.errorMessage}>
                {errorMessages.password ||
                  "Password must be at least 8 characters"}
              </span>
            )}
          </div>

          <div className={styles.forgetPassword}>
            <a
              className={`${styles.link} ${!emailExists ? styles.disabledLink : ""}`}
              onClick={handleForgotPasswordClick}
              style={{ cursor: emailExists ? "pointer" : "not-allowed" }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={!isFormValid()}
          >
            Login
          </button>

          <div className={styles.links}>
            <Link to="/Seller/Registration" className={styles.link}>
              Create New Account
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.popup}>
          <button
            className={styles.closeBtn}
            onClick={() => {
              setErrorMessages({
                email: "",
                password: "",
                confirmPassword: "",
              }),
                setShowForgotPassword(false);
            }}
          >
            ✖
          </button>
          <h2 className={styles.title}>Reset Password</h2>

          {!otpSent ? (
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter your email"
                className={`${styles.input} ${errorMessages.email ? styles.inputError : ""}`}
                value={forgotEmail}
                disabled // Pre-filled and disabled since it comes from login
              />
              {errorMessages.email && (
                <span className={styles.errorMessage}>
                  {errorMessages.email}
                </span>
              )}
              <button className={styles.loginBtn} onClick={handleSendOtp}>
                Send OTP
              </button>
            </div>
          ) : !otpVerified ? (
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter OTP"
                className={`${styles.input} ${errorMessages.email ? styles.inputError : ""}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errorMessages.email && (
                <span className={styles.errorMessage}>
                  {errorMessages.email}
                </span>
              )}
              <button className={styles.loginBtn} onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Enter new password"
                className={`${styles.input} ${errorMessages.password ? styles.inputError : ""}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errorMessages.password && (
                <span className={styles.errorMessage}>
                  {errorMessages.password}
                </span>
              )}
              <input
                type="password"
                placeholder="Confirm Your password"
                className={`${styles.input} ${errorMessages.password ? styles.inputError : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errorMessages.confirmPassword && (
                <span className={styles.errorMessage}>
                  {errorMessages.confirmPassword}
                </span>
              )}
              <button className={styles.loginBtn} onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerLogin;
