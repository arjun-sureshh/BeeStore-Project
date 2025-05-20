import React, { useEffect, useRef, useState } from "react";
import styles from "./SellerRegFirstPage.module.css";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleSellerId } from "../../../../../redux/toogleSlice";
import axios from "axios";

interface frontEndErrorProps {
  mobilenumber: string;
  email: string;
  password: string;
  otpverify: string;
}

const SellerRegFirstPage: React.FC = () => {
  const dispatch = useDispatch();
  const [passwordEye, setPasswordEye] = useState<boolean>(true);

  const [number, setNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [frontEndError, setFrontEndError] = useState<frontEndErrorProps>({
    mobilenumber: "",
    email: "",
    password: "",
    otpverify: "",
  });
  const [emailExist, setEmailExist] = useState<string>("");

  const emailRef = useRef<HTMLInputElement | null>(null); // ✅ Ensure correct type
  const mobileNumberRef = useRef<HTMLInputElement | null>(null); // ✅ Ensure correct type
  const otpRef = useRef<HTMLInputElement | null>(null); // ✅ Ensure correct type
  const passwordRef = useRef<HTMLInputElement | null>(null); // ✅ Ensure correct type

  // send the otp
  const sendOtp = async () => {
    if (!email) {
      // alert("Please enter an email first!");
      setFrontEndError({
        ...frontEndError,
        email: "Please enter an email first!",
      });
      emailRef.current?.focus();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/seller/send-otp",
        { sellerEmail: email },
      );
      setOtpSent(true);
      alert("OTP sent to your email!");
      console.log(response.data);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  // verify the otp

  const verifyOtp = async () => {
    if (!otp) {
      setFrontEndError({
        ...frontEndError,
        otpverify: "Please your otp Properly!",
      });
      otpRef.current?.focus();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/seller/verify-otp",
        { sellerEmail: email, otp: otp },
      );
      console.log(response.data);
      if (response.data && response.data.success) {
        alert("OTP Verified!");
        setEmailVerified(true);
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP", error);
    }
  };

  // handle the register btn
  const handleRegister = async () => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!number) {
      setFrontEndError({
        ...frontEndError,
        mobilenumber: "Please enter mobile number first!",
      });
      mobileNumberRef.current?.focus();
      return;
    } else if (!/^\d{10}$/.test(number)) {
      setFrontEndError({
        ...frontEndError,
        mobilenumber: "Mobile number must be exactly 10 digits!",
      });
      mobileNumberRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        mobilenumber: "",
      }));
    }

    if (!email) {
      setFrontEndError({
        ...frontEndError,
        email: "Please enter an email!",
      });
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setFrontEndError({
        ...frontEndError,
        password: "Please enter your password!",
      });
      passwordRef.current?.focus();
      return;
    } else if (!strongPasswordRegex.test(password)) {
      setFrontEndError({
        ...frontEndError,
        password:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
      passwordRef.current?.focus();
      return;
    } else if (!emailVerified) {
      setFrontEndError({
        ...frontEndError,
        email: "Verify Your Email",
      });
      emailRef.current?.focus();
      return;
    }

    // data set to pass into the api
    const data = {
      sellerMobileNumber: number,
      sellerEmail: email,
      sellerPassword: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/seller",
        data,
      );
      console.log(response.data);
      const seller_id = response.data.data._id;
      dispatch(toggleSellerId(""));
      setTimeout(() => dispatch(toggleSellerId(seller_id)), 0);

      setFrontEndError({
        email: "",
        password: "",
        otpverify: "",
        mobilenumber: "",
      });
      setEmailVerified(false);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.emailExist) {
          setEmailExist("Seller is already exists in this email");
        }
        console.log(error.response.data.message);
      } else {
        console.log("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    setPasswordEye(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.inp}>
          <div
            className={`${styles.input}  ${frontEndError.mobilenumber ? styles.borderRed : ""}`}
          >
            <input
              type="number"
              placeholder="Enter Mobile Number"
              onChange={(e) => setNumber(e.target.value)}
              ref={mobileNumberRef}
              maxLength={10}
            />
          </div>
          {frontEndError.mobilenumber && (
            <div className={styles.errorMsg}>
              <p>{frontEndError.mobilenumber}</p>
            </div>
          )}
        </div>

        <div className={styles.inpEmail}>
          <div
            className={`${styles.inputGroup}  ${frontEndError.email ? styles.borderRed : ""}`}
          >
            <input
              type="email"
              placeholder="Email Id"
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
            />
            {frontEndError.email && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.email}</p>
              </div>
            )}
            {emailExist && (
              <div className={styles.errorMsg}>
                <p>{emailExist} </p>
              </div>
            )}
          </div>
          <button className={styles.otpBtn} onClick={sendOtp}>
            Send OTP
          </button>
        </div>

        {otpSent && (
          <div className={styles.inpEmail}>
            <div
              className={`${styles.inputGroup}  ${frontEndError.otpverify ? styles.borderRed : ""}`}
            >
              <input
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                ref={otpRef}
              />
              {frontEndError.otpverify && (
                <div className={styles.errorMsg}>
                  <p>{frontEndError.otpverify}</p>
                </div>
              )}
            </div>
            <button className={styles.verifyBtn} onClick={verifyOtp}>
              Verify
            </button>
          </div>
        )}

        <div className={styles.inp}>
          <div
            className={`${styles.input}  ${frontEndError.password ? styles.borderRed : ""}`}
          >
            <input
              type={passwordEye ? "password" : "text"}
              placeholder="Create Password"
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
            />
            <div
              className={styles.eye}
              onClick={() => setPasswordEye(!passwordEye)}
            >
              {passwordEye ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {frontEndError.password && (
            <div className={styles.errorMsg}>
              <p>{frontEndError.password}</p>
            </div>
          )}
        </div>

        <div className={styles.whattt}>
          By continuing, I agree to BeeStore's Terms of Use & Privacy Policy
        </div>

        <div className={styles.register}>
          <div className={styles.registerbtn} onClick={handleRegister}>
            Register & Continue <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegFirstPage;
