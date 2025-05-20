import React, { useEffect, useRef, useState } from "react";
import styles from "./SellerRegThirdPage.module.css";
import { CiMobile3 } from "react-icons/ci";
import { HiOutlineMailOpen } from "react-icons/hi";
import { MdVerifiedUser } from "react-icons/md";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import axios from "axios";
import { toggleSellerId } from "../../../../../redux/toogleSlice";
import { useNavigate } from "react-router";

interface SellerFetchData {
  sellerName: string;
  sellerMobileNumber: string;
  sellerEmail: string;
}

interface frontEndErrorProps {
  GST: string;
  storeDescription: string;
  storePinCode: string;
  pickUpAddress: string;
  accoundNumber: string;
  reEnterAccNUmber: string;
  ifscCode: string;
}

const SellerRegThirdPage: React.FC = () => {
  const dispatch = useDispatch();
  const sellerId = useSelector((state: RootState) => state.toggle.sellerId);
  const [fetchedData, setFetchedData] = useState<SellerFetchData>({
    sellerEmail: "",
    sellerName: "",
    sellerMobileNumber: "",
  });

  const [GST, setGST] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const [storePinCode, setStorePinCode] = useState<string>("");
  const [pickUpAddress, setpickUpAddress] = useState<string>("");
  const [accoundNumber, setAccoundNumber] = useState<string>("");
  const [reEnterAccNUmber, setReEnterAccNUmber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [frontEndError, setFrontEndError] = useState<frontEndErrorProps>({
    GST: "",
    storeDescription: "",
    storePinCode: "",
    pickUpAddress: "",
    accoundNumber: "",
    reEnterAccNUmber: "",
    ifscCode: "",
  });

  // useref
  const gstRef = useRef<HTMLInputElement | null>(null);
  const storeDiscptionRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const pincodeRef = useRef<HTMLInputElement | null>(null);
  const accountNumberRef = useRef<HTMLInputElement | null>(null);
  const reAccountNumbernRef = useRef<HTMLInputElement | null>(null);
  const ifscCodeRef = useRef<HTMLInputElement | null>(null);

  // use navigation
  const navigate = useNavigate();

  // useEffect for fetch the current details
  useEffect(() => {
    if (!sellerId) return;
    console.log("seller id in the main:", sellerId);

    const fetchProductStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/${sellerId}`,
        );
        console.log(response.data);
        const sellerName = response.data.data.sellerName;
        const sellerEmail = response.data.data.sellerEmail;
        const sellerMobileNumber = response.data.data.sellerMobileNumber;

        setFetchedData({
          sellerEmail: sellerEmail,
          sellerMobileNumber: sellerMobileNumber,
          sellerName: sellerName,
        });
      } catch (error: any) {
        console.error(
          "Error fetching product status:",
          error.response?.data || error.message,
        );
      }
    };

    fetchProductStatus();
  }, [sellerId]);

  // handle register
  const handleRegister = async () => {
    // GST Validation (15 Characters)
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!GST) {
      setFrontEndError({
        ...frontEndError,
        GST: "Please enter your GST Number!",
      });
      gstRef.current?.focus();
      return;
    } else if (!gstRegex.test(GST)) {
      setFrontEndError({
        ...frontEndError,
        GST: "Invalid GST Number! Must be 15 characters (Format: 11AAAAA1111A1Z1).",
      });
      gstRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        GST: "",
      }));
    }

    // Store Description Validation
    if (!storeDescription) {
      setFrontEndError({
        ...frontEndError,
        storeDescription: "Please enter your Store Description!",
      });
      storeDiscptionRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        storeDescription: "",
      }));
    }

    // Store Pin Code Validation
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!storePinCode) {
      setFrontEndError({
        ...frontEndError,
        storePinCode: "Please enter your Store Pin Code!",
      });
      pincodeRef.current?.focus();
      return;
    } else if (!pincodeRegex.test(storePinCode)) {
      setFrontEndError({
        ...frontEndError,
        storePinCode:
          "Invalid PIN Code! Must be exactly 6 digits (first digit cannot be 0).",
      });
      pincodeRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        storePinCode: "",
      }));
    }

    // Pickup Address Validation
    if (!pickUpAddress) {
      setFrontEndError({
        ...frontEndError,
        pickUpAddress: "Please enter your Pickup Address!",
      });
      addressRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        pickUpAddress: "",
      }));
    }

    // Bank Account Validation (6-18 digits)
    const bankAccountRegex = /^[0-9]{6,18}$/;
    if (!accoundNumber) {
      setFrontEndError({
        ...frontEndError,
        accoundNumber: "Please enter your Bank Account Number!",
      });
      accountNumberRef.current?.focus();
      return;
    } else if (!bankAccountRegex.test(accoundNumber)) {
      setFrontEndError({
        ...frontEndError,
        accoundNumber: "Invalid Account Number! Must be between 6-18 digits.",
      });
      accountNumberRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        accoundNumber: "",
      }));
    }

    // Re-enter Bank Account Number Validation
    if (!reEnterAccNUmber) {
      setFrontEndError({
        ...frontEndError,
        reEnterAccNUmber: "Please re-enter your Bank Account Number!",
      });
      reAccountNumbernRef.current?.focus();
      return;
    } else if (accoundNumber !== reEnterAccNUmber) {
      setFrontEndError({
        ...frontEndError,
        reEnterAccNUmber: "Account numbers do not match!",
      });
      reAccountNumbernRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        reEnterAccNUmber: "",
      }));
    }

    // IFSC Code Validation (Indian IFSC Code Format)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscCode) {
      setFrontEndError({
        ...frontEndError,
        ifscCode: "Please enter your IFSC Code!",
      });
      ifscCodeRef.current?.focus();
      return;
    } else if (!ifscRegex.test(ifscCode)) {
      setFrontEndError({
        ...frontEndError,
        ifscCode: "Invalid IFSC Code! Must be in format (e.g., SBIN0001234).",
      });
      ifscCodeRef.current?.focus();
      return;
    } else {
      setFrontEndError((prev) => ({
        ...prev,
        ifscCode: "",
      }));
    }

    const addressData = {
      sellerId: sellerId,
      address: pickUpAddress,
      pincode: storePinCode,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/address/seller`,
        addressData,
      );
      console.log(response.data);

      setpickUpAddress("");
      setStorePinCode("");

      setFrontEndError({
        ...frontEndError,
        pickUpAddress: "",
        storePinCode: "",
      });
    } catch (error: any) {
      console.error(error);
    }

    const data = {
      sellerGST: GST,
      storeDiscription: storeDescription,
      bankAccountNo: accoundNumber,
      ifscCode: ifscCode,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/seller/bankDetails/${sellerId}`,
        data,
      );
      console.log(response.data);
      const seller_id = response.data.data._id;
      console.log("sellerid:", seller_id);

      dispatch(toggleSellerId(""));
      setTimeout(() => dispatch(toggleSellerId(seller_id)), 0); // Reinsert after a short delay
      setGST("");
      setStoreDescription("");
      setAccoundNumber("");
      setIfscCode("");
      setReEnterAccNUmber("");

      setFrontEndError({
        ...frontEndError,
        GST: "",
        storeDescription: "",
        accoundNumber: "",
        ifscCode: "",
        reEnterAccNUmber: "",
      });

      navigate("/SellerLanding");
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
      <div className={styles.border}>
        <div className={styles.first}>
          <h2> Hello,{fetchedData.sellerName}</h2>
        </div>
        <div className={styles.mobile}>Mobile & email verification</div>
        <div className={styles.phone}>
          <div className={styles.mobicon}>
            <CiMobile3 />
          </div>
          <div className={styles.mobnum}>
            {" "}
            +91{fetchedData.sellerMobileNumber}
          </div>
          {/* <div className={styles.verified}>verified</div> */}
        </div>
        <div className={styles.phone}>
          <div>
            <HiOutlineMailOpen />
          </div>
          <div className={styles.emailtxt}>{fetchedData.sellerEmail}</div>
          {/* <div className={styles.resend}>Resend Email</div> */}
        </div>
      </div>
      <div className={styles.secmain}>
        <div className={styles.store}>
          <div className={styles.id}> GSTIN</div>

          <div className={styles.fnamgst}>
            <TextField
              id="outlined-multiline-flexible"
              label="Enter GSTIN"
              value={GST}
              multiline
              maxRows={4}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.GST ? "rgb(220, 6, 6)" : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.GST
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.GST
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.GST
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setGST(e.target.value)}
              inputRef={gstRef}
            />
            {frontEndError.GST && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.GST}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.third}>
        <div className={styles.store}>
          <div className={styles.storee}>Store & Pickup Details</div>

          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.storeDescription ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Enter Store Description"
              value={storeDescription}
              multiline
              maxRows={4}
              rows={2}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.storeDescription
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.storeDescription
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.storeDescription
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.storeDescription
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setStoreDescription(e.target.value)}
              inputRef={storeDiscptionRef}
            />
            {frontEndError.storeDescription && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.storeDescription}</p>
              </div>
            )}
          </div>

          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.storePinCode ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Enter Pickup Pincode"
              value={storePinCode}
              type="number"
              maxRows={1}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.storePinCode
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.storePinCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.storePinCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.storePinCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setStorePinCode(e.target.value)}
              inputRef={pincodeRef}
            />
            {frontEndError.storePinCode && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.storePinCode}</p>
              </div>
            )}
          </div>
          <div className={styles.storee}>
            Please enter a pincode of "IN-KL" as per your GSTIN
          </div>

          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.pickUpAddress ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Enter Pickup Address"
              value={pickUpAddress}
              multiline
              maxRows={4}
              rows={2}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.pickUpAddress
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.pickUpAddress
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.pickUpAddress
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.pickUpAddress
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setpickUpAddress(e.target.value)}
              inputRef={addressRef}
            />
            {frontEndError.pickUpAddress && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.pickUpAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.third}>
        <div className={styles.store}>
          <div className={styles.storee}>Bank Details</div>

          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.accoundNumber ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Enter Your Account No:"
              value={accoundNumber}
              multiline
              maxRows={1}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.accoundNumber
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.accoundNumber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.accoundNumber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.accoundNumber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setAccoundNumber(e.target.value)}
              inputRef={accountNumberRef}
            />
            {frontEndError.accoundNumber && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.accoundNumber}</p>
              </div>
            )}
          </div>
          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.reEnterAccNUmber ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Re-Enter Your Account No:"
              value={reEnterAccNUmber}
              multiline
              maxRows={1}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.reEnterAccNUmber
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.reEnterAccNUmber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.reEnterAccNUmber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.reEnterAccNUmber
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setReEnterAccNUmber(e.target.value)}
              inputRef={reAccountNumbernRef}
            />
            {frontEndError.reEnterAccNUmber && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.reEnterAccNUmber}</p>
              </div>
            )}
          </div>
          <div className={styles.display}>
            <MdVerifiedUser /> Your display name is available
          </div>
          <div className={styles.fnam}>
            <TextField
              className={`${frontEndError.ifscCode ? styles.borderRed : ""}`}
              id="outlined-multiline-flexible"
              label="Enter ifscCode"
              value={ifscCode}
              multiline
              maxRows={1}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderColor: frontEndError.ifscCode
                    ? "rgb(220, 6, 6)"
                    : "inherit",
                  "& fieldset": {
                    borderColor: frontEndError.ifscCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&:hover fieldset": {
                    borderColor: frontEndError.ifscCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: frontEndError.ifscCode
                      ? "rgb(220, 6, 6)"
                      : "inherit",
                  },
                },
              }}
              onChange={(e) => setIfscCode(e.target.value)}
              inputRef={ifscCodeRef}
            />
            {frontEndError.ifscCode && (
              <div className={styles.errorMsg}>
                <p>{frontEndError.ifscCode}</p>
              </div>
            )}
          </div>
          <div className={styles.save} onClick={handleRegister}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegThirdPage;
