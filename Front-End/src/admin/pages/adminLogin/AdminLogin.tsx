import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@mui/material";

interface InputData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const [inputData, setInputData] = useState<InputData>({
    email: "",
    password: "",
  });
  const [errorMessages, setErrorMessages] = useState<InputData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setEmailExists] = useState<boolean>(true);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" });
    setEmailExists(true);
  };

  // Focus input field
  const focusInput = (name: string) => {
    const input = formRef.current?.querySelector(
      `input[name='${name}']`,
    ) as HTMLInputElement | null;
    input?.focus();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages({ email: "", password: "" });
    setIsLoading(true);

    // Frontend validation
    if (!inputData.email) {
      setErrorMessages({ ...errorMessages, email: "Email is required" });
      focusInput("email");
      setIsLoading(false);
      return;
    }
    if (!inputData.password) {
      setErrorMessages({ ...errorMessages, password: "Password is required" });
      focusInput("password");
      setIsLoading(false);
      return;
    }

    const formData = {
      email: inputData.email,
      password: inputData.password,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/Login`,
        formData,
      );
      if (response.data.userType === "admin") {
        sessionStorage.setItem("admin", response.data.token);
        const redirectUrl = "/Admin/"; // Customize this URL
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
            focusInput("password");
          } else if (message.includes("user") || message.includes("account")) {
            setErrorMessages((prev) => ({
              ...prev,
              email: "We couldn’t find an account with this email.",
            }));
            setEmailExists(false);
            focusInput("email");
          } else {
            setErrorMessages((prev) => ({ ...prev, email: message }));
            focusInput("email");
          }
        } else {
          setErrorMessages((prev) => ({
            ...prev,
            email: "Something went wrong. Please try again.",
          }));
          focusInput("email");
        }
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          email: "Network error. Please check your connection.",
        }));
        focusInput("email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const reset = () => {
    setInputData({ email: "", password: "" });
    setErrorMessages({ email: "", password: "" });
    setEmailExists(true);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Admin Login</h2>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={inputData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className={styles.input}
            fullWidth
            error={!!errorMessages.email}
            helperText={errorMessages.email}
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={inputData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={styles.input}
            fullWidth
            error={!!errorMessages.password}
            helperText={errorMessages.password}
            variant="outlined"
          />
          <div className={styles.buttonGroup}>
            <Button
              type="button"
              variant="outlined"
              onClick={reset}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
        <div className={styles.linkContainer}>
          <Link to="/Admin/Registration" className={styles.navLink}>
            Don't have an account? Go to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
