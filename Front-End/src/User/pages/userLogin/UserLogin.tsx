import React, { useState } from "react";
import styles from "./UserLogin.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

interface ValidationState {
  email: boolean;
  password: boolean;
}

interface ErrorMessages {
  email: string;
  password: string;
  confirmPassword: string;
}

const UserLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [isValid, setIsValid] = useState<ValidationState>({
    email: true,
    password: true,
  });

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
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
  const [emailExists, setEmailExists] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // Extract redirect URL from query parameters
  const query = new URLSearchParams(location.search);
  const redirectUrl = query.get("redirect") || "/"; // Default to home page

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/user/check-email`,
            { email: value },
          );
          setEmailExists(response.data.exists);
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
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      isValid.email &&
      isValid.password
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Login`,
        formData,
      );
      if (response.data.userType === "user") {
        sessionStorage.setItem("user", response.data.token);
        navigate(redirectUrl, { replace: true });
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
            setEmailExists(false);
          } else {
            setErrorMessages((prev) => ({ ...prev, email: message }));
          }
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

  const handleForgotPasswordClick = () => {
    if (emailExists) {
      setForgotEmail(formData.email);
      setShowForgotPassword(true);
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`http://localhost:5000/api/user/send-otp`, {
        email: forgotEmail,
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
        `http://localhost:5000/api/user/verify-otp`,
        {
          email: forgotEmail,
          otp,
        },
      );
      if (response.data.success) {
        setOtpVerified(true);
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
      await axios.post(`http://localhost:5000/api/user/reset-password`, {
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
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              {showForgotPassword
                ? "Reset Your Password"
                : "Looks like you're new here!"}
            </h1>
            <p className={styles.welcomeText}>
              {showForgotPassword
                ? "Follow the steps to reset your password"
                : "Sign up with your details to get started"}
            </p>
          </div>
          <div className={styles.illustration}>
            {/* Illustration of devices */}
          </div>
        </div>
        <div className={styles.rightPanel}>
          {!showForgotPassword ? (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${!isValid.email || errorMessages.email ? styles.inputError : ""}`}
                  placeholder="Enter your email"
                />
                {(!isValid.email || errorMessages.email) && formData.email && (
                  <span className={styles.errorMessage}>
                    {errorMessages.email ||
                      "Please enter a valid email address"}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.inputField} ${!isValid.password || errorMessages.password ? styles.inputError : ""}`}
                  placeholder="At least 8 characters"
                />
                {(!isValid.password || errorMessages.password) &&
                  formData.password && (
                    <span className={styles.errorMessage}>
                      {errorMessages.password ||
                        "Password must be at least 8 characters"}
                    </span>
                  )}
              </div>

              <div className={styles.termsContainer}>
                <a
                  className={`${styles.link} ${!emailExists ? styles.disabledLink : ""}`}
                  onClick={handleForgotPasswordClick}
                  style={{ cursor: emailExists ? "pointer" : "not-allowed" }}
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className={styles.continueButton}
                disabled={!isFormValid()}
              >
                CONTINUE
              </button>
              <div className={styles.loginLinkContainer}>
                <Link to="/User/Registration" className={styles.loginLink}>
                  Create new Account?
                </Link>
              </div>
            </form>
          ) : (
            <div className={styles.form}>
              {!otpSent ? (
                <div className={styles.inputGroup}>
                  <label htmlFor="forgotEmail" className={styles.inputLabel}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    disabled
                    className={`${styles.inputField} ${errorMessages.email ? styles.inputError : ""}`}
                    placeholder="Enter your email"
                  />
                  {errorMessages.email && (
                    <span className={styles.errorMessage}>
                      {errorMessages.email}
                    </span>
                  )}
                  <button
                    className={styles.continueButton}
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                </div>
              ) : !otpVerified ? (
                <div className={styles.inputGroup}>
                  <label htmlFor="otp" className={styles.inputLabel}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${styles.inputField} ${errorMessages.email ? styles.inputError : ""}`}
                    placeholder="Enter OTP"
                  />
                  {errorMessages.email && (
                    <span className={styles.errorMessage}>
                      {errorMessages.email}
                    </span>
                  )}
                  <button
                    className={styles.continueButton}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <label htmlFor="newPassword" className={styles.inputLabel}>
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${styles.inputField} ${errorMessages.password ? styles.inputError : ""}`}
                    placeholder="Enter new password"
                  />
                  {errorMessages.password && (
                    <span className={styles.errorMessage}>
                      {errorMessages.password}
                    </span>
                  )}
                  <label
                    htmlFor="confirmPassword"
                    className={styles.inputLabel}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${styles.inputField} ${errorMessages.confirmPassword ? styles.inputError : ""}`}
                    placeholder="Confirm your password"
                  />
                  {errorMessages.confirmPassword && (
                    <span className={styles.errorMessage}>
                      {errorMessages.confirmPassword}
                    </span>
                  )}
                  <button
                    className={styles.continueButton}
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
