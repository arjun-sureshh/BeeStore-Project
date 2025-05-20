import React, { useEffect, useRef, useState } from "react";
import styles from "./AdminEditProfile.module.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { togglePageControl, toggleResetPage } from "../../../redux/toogleSlice";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";

interface InputData {
  adminName: string;
  adminEmail: string;
}

interface fetchData {
  adminName: string;
  adminEmail: string;
  _id: string;
}
const AdminEditProfile: React.FC = () => {
  const dispatch = useDispatch(); // dispatch method in redux

  const formref = useRef<HTMLFormElement | null>(null); // used for focus the empty input
  const [inputData, setInputData] = useState<InputData>({
    adminName: "",
    adminEmail: "",
  }); // handle the data from input and fetched data

  const [error, setError] = useState<InputData>({
    adminName: "",
    adminEmail: "",
  }); // handle when we submit with out data
  const [alldata, setAlldata] = useState<fetchData>({
    adminName: "",
    adminEmail: "",
    _id: "",
  }); // handle all fetch data
  const [backEndError, setBackEndError] = useState<string>(""); // handle the back end error
  const [, setDataAdded] = useState<Record<string, any>>({}); //handle addededData
  const [clientError, setClientError] = useState<string>(""); // handle error like no changes detected
  const [successfullMsg, setSuccessfullMsg] = useState<String>("");

  const token = sessionStorage.getItem("admin");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmindata = async () => {
      if (!token) {
        navigate("/Admin/Login"); // Redirect if no token found
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token, // Send token in header
          },
        });
        setAlldata(response.data); // Set seller details in state
        console.log(response.data, "admindata");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/login"); // Redirect to login on error
      }
    };

    fetchAdmindata();
  }, [token]);

  // handle change occures in this
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };
  //  handle the submit button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError({
      adminName: "",
      adminEmail: "",
    }); // Clear previous errors
    setBackEndError(""); // Clear backend error message

    // funtion for focus
    const focusInput = (name: string) => {
      const input = formref.current?.querySelector(
        `input[name='${name}']`,
      ) as HTMLInputElement | null;
      input?.focus(); // Now TypeScript knows it's an input field
    };

    // Frontend validation
    if (!inputData.adminName) {
      setError({ ...error, adminName: "Name is required" });
      focusInput("name");
      return;
    }
    if (!inputData.adminEmail) {
      setError({ ...error, adminEmail: "Email is required" });
      focusInput("email");
      return;
    }

    // Check if any data has changed
    if (
      inputData.adminName === alldata.adminName &&
      inputData.adminEmail === alldata.adminEmail
    ) {
      console.log("No changes detected, skipping update.");
      setClientError("No changes detected, skipping update.");
      setSuccessfullMsg("");
      return;
    }

    // Prepare updated data (only changed fields)
    const updatedData: Partial<InputData> = {};
    if (inputData.adminName !== alldata.adminName)
      updatedData.adminName = inputData.adminName;
    if (inputData.adminEmail !== alldata.adminEmail)
      updatedData.adminEmail = inputData.adminEmail;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/${alldata._id}`,
        updatedData,
      );
      setDataAdded(response.data);
      setAlldata({ ...alldata, ...updatedData }); // Update local state with new data
      console.log("Updated successfully:", response.data);
      setSuccessfullMsg(response.data.message);
      setInputData({ adminEmail: "", adminName: "" });
      setClientError("");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setBackEndError(error.response.data.message);
        setClientError("");
      } else {
        setBackEndError("Something went wrong. Please try again.");
        setClientError("");
      }
    }
  };

  // fetch data from the back end
  const fetchData = async () => {
    if (!alldata._id) {
      throw new Error(" ID is required");
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/${alldata._id}`,
      );
      const data = response.data.data;
      setInputData({
        adminName: data.adminName,
        adminEmail: data.adminEmail,
      });
      setAlldata(response.data.data);
    } catch (error) {
      console.error("Error Deleting admin account Detials:", error);
    }
  };

  // reset function

  const reset = () => {
    setInputData({
      adminName: "",
      adminEmail: "",
    });
    setBackEndError("");
    // setDataAdded({});
    setClientError("");
    setSuccessfullMsg("");
  };

  // useeffect
  useEffect(() => {
    fetchData();
    setBackEndError("");
    setClientError("");
    setSuccessfullMsg("");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.homeLink}>
        {" "}
        <span onClick={() => dispatch(toggleResetPage())}>
          <IoIosArrowBack /> Home
        </span>
      </div>
      <div className={styles.profileCardCOntainer}>
        <div className={styles.card}>
          <div className={styles.moveBack}>
            <p
              className={styles.link}
              onClick={() => dispatch(togglePageControl("AdminProfile"))}
            >
              <IoArrowBackCircleOutline />
            </p>
          </div>
          <h1 className={styles.title}>Edit Profile</h1>
          <form
            className={styles.form}
            ref={formref}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div className={styles.inputGroup}>
              <label className={styles.label}>Your Name</label>
              <input
                type="text"
                name="adminName"
                value={inputData.adminName}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="adminEmail"
                value={inputData.adminEmail}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>
            {successfullMsg && (
              <div className={styles.successMsg}>{successfullMsg}</div>
            )}
            {clientError && (
              <div className={styles.noChanges}>{clientError}</div>
            )}
            {backEndError && (
              <div className={styles.noChanges}>{backEndError}</div>
            )}

            <button type="submit" className={styles.primaryButton}>
              Save Changes
            </button>
          </form>

          <p className={styles.link} onClick={reset}>
            Cancel
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProfile;
