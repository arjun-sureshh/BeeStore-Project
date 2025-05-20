import React, { useState, useEffect, useRef } from "react";
import styles from "./AdminChangePassword.module.css";
import { useDispatch } from "react-redux";
import { togglePageControl, toggleResetPage } from "../../../redux/toogleSlice";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import axios from "axios";
import { TextField } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";

interface InputData {
  adminEmail: string;
  adminPassword: string;
  adminconfirmPassword: string;
}

interface fetchData {
  adminEmail: string;
  adminPassword: string;
}

const AdminChangePassword: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useDispatch();
  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [id] = useState<string>("67b437ba9acde33aace70f15");

  const [inputData, setInputData] = useState<InputData>({
    adminEmail: "",
    adminPassword: "",
    adminconfirmPassword: "",
  });

  const [alldata, setAlldata] = useState<fetchData>({
    adminEmail: "",
    adminPassword: "",
  });

  const [error, setError] = useState<Partial<InputData>>({});
  const [, setPasswordError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch admin details
  const fetchData = async () => {
    if (!id) {
      console.error("ID is required");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/${id}`);
      setAlldata(response.data.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
    setError({ ...error, [e.target.name]: "" });
    setPasswordError("");
  };

  const sendOtp = async () => {
    if (inputData.adminEmail !== alldata.adminEmail) {
      alert("Email does not match the logged-in admin!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/send-otp",
        {
          adminEmail: inputData.adminEmail,
        },
      );
      alert(response.data.message);
      setStep(2);
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Error sending OTP. Please try again.",
      );
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if value is entered
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join(""); // Combine OTP digits into one string
    if (otpCode.length !== 4) {
      alert("Please enter a 4-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/verify-otp",
        {
          adminEmail: inputData.adminEmail,
          otp: otpCode,
        },
      );
      alert(response.data.message);
      setStep(3);
      setOtp(["", "", "", ""]);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Error verifying OTP. Please try again.",
      );
    }
  };

  // strong password
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Focus function
  const focusInput = (name: string) => {
    const input = formRef.current?.querySelector(
      `TextField[name='${name}']`,
    ) as HTMLInputElement | null;
    input?.focus();
  };

  // change paasword

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputData.adminPassword) {
      setError({
        adminconfirmPassword: "",
        adminPassword: "Password is required",
      });
      focusInput("adminPassword");
      return;
    } else if (!strongPasswordRegex.test(inputData.adminPassword)) {
      setError({
        adminconfirmPassword: "",
        adminPassword:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
      focusInput("adminPassword");
      console.log(error.adminPassword);
      return;
    }

    if (!inputData.adminconfirmPassword) {
      setError({
        adminPassword: "",
        adminconfirmPassword: "Confirm password is required",
      });
      focusInput("adminconfirmPassword");
      return;
    } else if (inputData.adminPassword !== inputData.adminconfirmPassword) {
      setError({
        adminPassword: "",
        adminconfirmPassword: "Passwords do not match",
      });
      focusInput("adminconfirmPassword");
      return;
    }

    // if (Object.keys(newErrors).length > 0) {
    //   setError(newErrors);
    //   return;
    // }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/change-password/${id}`,
        { adminPassword: inputData.adminPassword },
      );
      alert(response.data.message);
      setError({
        adminconfirmPassword: "",
        adminEmail: "",
        adminPassword: "",
      });
      setInputData({
        adminconfirmPassword: "",
        adminEmail: "",
        adminPassword: "",
      });
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Password is not Changed. Please try again.",
      );
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.homeLink}>
        {" "}
        <span onClick={() => dispatch(toggleResetPage())}>
          <IoIosArrowBack /> Home
        </span>
      </div>
      <div className={styles.profileCardCOntainer}>
        <div className={styles.formBox}>
          <div className={styles.moveBack}>
            <p
              className={styles.link}
              onClick={() => dispatch(togglePageControl("AdminProfile"))}
            >
              <IoArrowBackCircleOutline />
            </p>
          </div>
          <h2 className={styles.heading}>Change Password</h2>
          <p className={styles.subText}>
            Secure your account with a new password
          </p>

          <form className={styles.form} ref={formRef}>
            {step === 1 && (
              <>
                <TextField
                  label="Email"
                  type="email"
                  name="adminEmail"
                  value={inputData.adminEmail}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className={styles.input}
                  fullWidth
                  error={!!error.adminEmail && !inputData.adminEmail}
                  helperText={
                    error.adminEmail && !inputData.adminEmail
                      ? error.adminEmail
                      : ""
                  }
                />
                <button
                  type="button"
                  className={`${styles.button} ${styles.saveButton}`}
                  onClick={sendOtp}
                >
                  Get OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className={styles.otpBox}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (otpRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className={`${styles.button} ${styles.saveButton}`}
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  name="adminPassword"
                  value={inputData.adminPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className={styles.input}
                  fullWidth
                  error={!!error.adminPassword && !inputData.adminPassword}
                  helperText={error.adminPassword}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: error.adminPassword ? "red" : "inherit", // Red only when error exists
                    },
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="adminconfirmPassword"
                  value={inputData.adminconfirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className={styles.input}
                  fullWidth
                  error={
                    !!error.adminconfirmPassword &&
                    !inputData.adminconfirmPassword
                  }
                  helperText={error.adminconfirmPassword}
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: error.adminconfirmPassword ? "red" : "inherit", // Red only when error exists
                    },
                  }}
                />
                <button
                  type="submit"
                  className={`${styles.button} ${styles.saveButton}`}
                  onClick={changePassword}
                >
                  Update Password
                </button>
              </>
            )}

            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => {
                setStep(1);
                setInputData({
                  adminEmail: "",
                  adminPassword: "",
                  adminconfirmPassword: "",
                });
                setError({});
                setPasswordError("");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePassword;
