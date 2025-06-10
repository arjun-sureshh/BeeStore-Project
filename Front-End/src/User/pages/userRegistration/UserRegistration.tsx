import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./UserRegistration.module.css";
import axios from "axios";

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
}

interface ValidationState {
  fullName: boolean;
  email: boolean;
  mobileNumber: boolean;
  password: boolean;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [isValid, setIsValid] = useState<ValidationState>({
    fullName: true,
    email: true,
    mobileNumber: true,
    password: true,
  });

  const [emailExist, setEmailExist] = useState<string>("");
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmailExist("");
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let fieldValid = true;

    switch (name) {
      case "fullName":
        fieldValid = value.trim().length >= 3;
        break;
      case "email":
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";
        break;
      case "mobileNumber":
        fieldValid = /^[6-9]\d{9}$/.test(value) || value === "";
        break;
      case "password":
        fieldValid =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ||
          value === "";
        break;
      default:
        break;
    }

    setIsValid((prev) => ({
      ...prev,
      [name]: fieldValid,
    }));
  };

  const isFormValid = () => {
    return (
      Object.values(isValid).every((valid) => valid) &&
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.mobileNumber.trim() !== "" &&
      formData.password.trim() !== ""
    );
  };

  // Create user Account

  const createUseAccount = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    const data = {
      userName: formData.fullName,
      userEmail: formData.email,
      userPassword: formData.password,
      userMobileNumber: formData.mobileNumber,
    };
    try {
      const response = await axios.post(`${API_URL}/api/user`, data);
      console.log(response.data);
      navigate("/");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.emailExist) {
          setEmailExist("User is already exists in this email");
        }
        console.log(error.response.data.message);
      } else {
        console.log("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Looks like you're new here!</h1>
            <p className={styles.welcomeText}>
              Sign up with your details to get started
            </p>
          </div>
          <div className={styles.illustration}>
            {/* Illustration of devices */}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={createUseAccount}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName" className={styles.inputLabel}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`${styles.inputField} ${!isValid.fullName ? styles.inputError : ""}`}
                placeholder="Enter your full name"
              />
              {!isValid.fullName && formData.fullName && (
                <span className={styles.errorMessage}>
                  Name should be at least 3 characters
                </span>
              )}
            </div>

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
                className={`${styles.inputField}  ${!isValid.email || emailExist ? styles.inputError : ""}`}
                placeholder="Enter your email"
              />
              {!isValid.email && formData.email && (
                <span className={styles.errorMessage}>
                  Please enter a valid email address
                </span>
              )}
              {emailExist && (
                <span className={styles.errorMessage}>{emailExist}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="mobileNumber" className={styles.inputLabel}>
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`${styles.inputField} ${!isValid.mobileNumber ? styles.inputError : ""} `}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {!isValid.mobileNumber && formData.mobileNumber && (
                <span className={styles.errorMessage}>
                  Please enter a valid 10 digit mobile number
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
                className={`${styles.inputField} ${!isValid.password ? styles.inputError : ""} `}
                placeholder="At least 8 characters"
              />
              {!isValid.password && formData.password && (
                <span className={styles.errorMessage}>
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number.
                </span>
              )}
            </div>

            <div className={styles.termsContainer}>
              <p className={styles.termsText}>
                By continuing, you agree to Flipkart's{" "}
                <Link to="" className={styles.link}>
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to="" className={styles.link}>
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <button
              type="submit"
              className={styles.continueButton}
              disabled={!isFormValid()}
            >
              CONTINUE
            </button>
            <div className={styles.loginLinkContainer}>
              <Link to="/User/Login" className={styles.loginLink}>
                Existing User? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
