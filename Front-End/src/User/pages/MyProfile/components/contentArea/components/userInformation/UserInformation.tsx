import React, { useEffect, useState } from "react";
import styles from "./UserInformation.module.css";
import { Button, TextField } from "@mui/material";
import axios from "axios";

interface handleEditboolean {
  personalInfo: boolean;
  gender: boolean;
  address: boolean;
  mobile: boolean;
  [key: string]: boolean;
}

interface userDataprops {
  _id?: string;
  userName?: string;
  userMobileNumber?: string;
  userEmail?: string;
  createdAt?: string;
  userGender?: string;
}

interface UserInformationprops {
  userData?: userDataprops | null;
}

interface InputDataProps {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
}

interface ValidationState {
  fullName: boolean;
  email: boolean;
  mobileNumber: boolean;
}

const UserInformation: React.FC<UserInformationprops> = ({ userData }) => {
  const [emailExist, setEmailExist] = useState<string>("");
const API_URL = import.meta.env.VITE_API_URL;

  const [inputData, setInputdata] = useState<InputDataProps>({
    fullName: "",
    email: "",
    gender: "",
    mobileNumber: "",
  });

  const [handleEdit, setHandleEdit] = useState<handleEditboolean>({
    personalInfo: false,
    gender: false,
    address: false,
    mobile: false,
  });

  const [isValid, setIsValid] = useState<ValidationState>({
    fullName: true,
    email: true,
    mobileNumber: true,
  });

  const handlechange = (name: string) => {
    setHandleEdit({
      ...handleEdit,
      [name]: !handleEdit[name],
    });
  };
  // function for set the field values into the inputData
  const handleOnChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputdata({
      ...inputData,
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
      default:
        break;
    }

    setIsValid((prev) => ({
      ...prev,
      [name]: fieldValid,
    }));
  };

  // const isFormValid = () => {
  //   return (
  //     Object.values(isValid).every(valid => valid) &&
  //     inputData.fullName.trim() !== '' &&
  //     inputData.email.trim() !== '' &&
  //     inputData.mobileNumber.trim() !== ''
  //   );
  // };

  // update the datas when we click on the save btn

  const handleSave = async () => {
    const datas = {
      userName: inputData.fullName,
      userMobileNumber: inputData.mobileNumber,
      userEmail: inputData.email,
      userGender: inputData.gender,
    };
    console.log(datas);

    try {
      const response = await axios.put(
        `${API_URL}/api/user/${userData?._id}`,
        datas,
      );
      console.log(response.data);
      setHandleEdit({
        personalInfo: false,
        gender: false,
        address: false,
        mobile: false,
      });
      setEmailExist("");
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

  // useeffect for the data from the user
  useEffect(() => {
    setInputdata({
      fullName: userData?.userName || "",
      email: userData?.userEmail || "",
      gender: userData?.userGender || "",
      mobileNumber: userData?.userMobileNumber || "",
    });
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.headNameSection}>
        <div
          className={`${styles.headName} ${!handleEdit.personalInfo && styles.disabled}`}
        >
          Personal Information
        </div>
        <div
          className={styles.editBtn}
          onClick={() => handlechange("personalInfo")}
        >
          {" "}
          {handleEdit.personalInfo ? "Cancel" : "Edit"}
        </div>
      </div>
      <div className={styles.inputBoxSection}>
        <div className={`${styles.inputBox} `}>
          <TextField
            id="outlined-textarea"
            label="Full Name"
            name="fullName"
            placeholder="Full Name ......"
            multiline
            value={inputData.fullName}
            disabled={!handleEdit.personalInfo}
            onChange={handleOnChnage}
            sx={{
              width: "270px",
              "& .MuiInputBase-root.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style when disabled
              },
              "& textarea.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style specifically to textarea
              },
            }}
          />
          {!isValid.fullName && inputData.fullName && (
            <span className={styles.errorMessage}>
              Name should be at least 3 characters
            </span>
          )}
        </div>

        <div className={styles.inputBox}>
          {handleEdit.personalInfo && (
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>

      <div className={styles.headNameSection}>
        <div
          className={`${styles.headName}  ${!handleEdit.personalInfo && styles.disabled}`}
        >
          Your Gender
        </div>
        {/* <div className={styles.editBtn} onClick={ () =>handlechange("gender")}> {handleEdit.gender ? "Edit" : "Save"}</div> */}
      </div>

      <div className={styles.inputBoxSection}>
        <div className={`${styles.radio} `}>
          <input
            type="radio"
            name="gender"
            checked={inputData.gender === "male"}
            onChange={handleOnChnage}
            value={"male"}
            disabled={!handleEdit.personalInfo}
            className={handleEdit.personalInfo ? "" : styles.disabledTextField}
          />
          <p>Male</p>
        </div>
        <div className={styles.radio}>
          <input
            type="radio"
            name="gender"
            checked={inputData.gender === "female"}
            onChange={handleOnChnage}
            value={"female"}
            disabled={!handleEdit.personalInfo}
            className={handleEdit.personalInfo ? "" : styles.disabledTextField}
          />
          <p>Female</p>
        </div>
      </div>

      <div className={styles.headNameSection}>
        <div
          className={`${styles.headName} ${!handleEdit.address && styles.disabled}`}
        >
          Email Address
        </div>
        <div className={styles.editBtn} onClick={() => handlechange("address")}>
          {" "}
          {handleEdit.address ? "Cancel" : "Edit"}
        </div>
      </div>
      <div className={styles.inputBoxSection}>
        <div className={styles.inputBox}>
          <TextField
            id="outlined-textarea"
            label="Email Address"
            placeholder="email@gmail.com"
            name="email"
            value={inputData.email}
            multiline
            disabled={!handleEdit.address}
            onChange={handleOnChnage}
            sx={{
              width: "270px",
              "& .MuiInputBase-root.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style when disabled
              },
              "& textarea.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style specifically to textarea
              },
            }}
          />
          {!isValid.email && inputData.email && (
            <span className={styles.errorMessage}>
              Please enter a valid email address
            </span>
          )}
          {emailExist && (
            <span className={styles.errorMessage}>{emailExist}</span>
          )}
        </div>

        <div className={styles.inputBox}>
          {handleEdit.address && (
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>

      <div className={styles.headNameSection}>
        <div
          className={`${styles.headName} ${!handleEdit.mobile && styles.disabled}`}
        >
          Mobile Number
        </div>
        <div className={styles.editBtn} onClick={() => handlechange("mobile")}>
          {" "}
          {handleEdit.mobile ? "Cancel" : "Edit"}
        </div>
      </div>
      <div className={styles.inputBoxSection}>
        <div className={styles.inputBox}>
          <TextField
            id="outlined-textarea"
            label="Mobile Number"
            placeholder="**********"
            name="mobileNumber"
            type="number"
            value={inputData.mobileNumber}
            multiline
            disabled={!handleEdit.mobile}
            onChange={handleOnChnage}
            slotProps={{
              input: {
                inputProps: { maxLength: 10, pattern: "[0-9]*" }, // Correct way to pass maxLength
              },
            }}
            sx={{
              length: "10",
              "& .MuiInputBase-root.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style when disabled
              },
              "& textarea.Mui-disabled": {
                cursor: "not-allowed", // Apply cursor style specifically to textarea
              },
            }}
          />
          {!isValid.mobileNumber && inputData.mobileNumber && (
            <span className={styles.errorMessage}>
              Please enter a valid 10 digit mobile number
            </span>
          )}
        </div>
        {handleEdit.mobile && (
          <div className={styles.inputBox}>
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInformation;
