import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminRegistration.module.css";
import axios from "axios";
import { TextField, CircularProgress } from "@mui/material";

interface InputData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminRegister: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [inputData, setInputData] = useState<InputData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<InputData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [backendError, setBackendError] = useState<string>("");
  const [, setDataAdded] = useState<object>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
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
    setError({ name: "", email: "", password: "", confirmPassword: "" });
    setPasswordError("");
    setBackendError("");
    setIsLoading(true);

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Frontend validation
    if (!inputData.name) {
      setError({ ...error, name: "Name is required" });
      focusInput("name");
      setIsLoading(false);
      return;
    }
    if (!inputData.email) {
      setError({ ...error, email: "Email is required" });
      focusInput("email");
      setIsLoading(false);
      return;
    }
    if (!inputData.password) {
      setError({ ...error, password: "Password is required" });
      focusInput("password");
      setIsLoading(false);
      return;
    }
    if (!strongPasswordRegex.test(inputData.password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      );
      focusInput("password");
      setIsLoading(false);
      return;
    }
    if (!inputData.confirmPassword) {
      setError({ ...error, confirmPassword: "Confirm password is required" });
      focusInput("confirmPassword");
      setIsLoading(false);
      return;
    }
    if (inputData.password !== inputData.confirmPassword) {
      setPasswordError("Passwords do not match");
      focusInput("confirmPassword");
      setIsLoading(false);
      return;
    }

    const data = {
      adminName: inputData.name,
      adminEmail: inputData.email,
      adminPassword: inputData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin",
        data,
      );
      setDataAdded(response.data);
      setInputData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setBackendError(error.response.data.message || "Registration failed");
      } else {
        setBackendError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const reset = () => {
    setInputData({ name: "", email: "", password: "", confirmPassword: "" });
    setError({ name: "", email: "", password: "", confirmPassword: "" });
    setPasswordError("");
    setBackendError("");
    setDataAdded({});
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Admin Registration</h2>
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={inputData.name}
            onChange={handleChange}
            placeholder="Enter admin name"
            className={styles.input}
            fullWidth
            error={!!error.name}
            helperText={error.name}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={inputData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className={styles.input}
            fullWidth
            error={!!error.email}
            helperText={error.email}
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
            error={!!error.password}
            helperText={error.password}
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={inputData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={styles.input}
            fullWidth
            error={!!error.confirmPassword}
            helperText={error.confirmPassword}
          />
          {(passwordError || backendError) && (
            <div className={styles.errorMessage}>
              {passwordError || backendError}
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={reset}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <div className={styles.linkContainer}>
          <Link to="/Admin/Login" className={styles.navLink}>
            Already have an account? Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
