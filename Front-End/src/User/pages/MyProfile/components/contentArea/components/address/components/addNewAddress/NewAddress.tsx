import React, { useEffect, useState } from "react";
import styles from "./NewAddress.module.css";
import CustomInput from "./components/customInput/CustomInput";
import { MdMyLocation } from "react-icons/md";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import DropDown from "./components/textArea/dropDown";
import { userDataprops } from "../../Address";

interface fetchedUserData {
  _id?: string;
  userId?: string;
  address?: string;
  pincode?: string;
  createdAt?: string;
  city?: string;
  mobileNumber?: string;
  alternateMobileNumber?: string;
  fullName?: string;
  addressType?: string;
  districtId?: string;
}

interface NewAddressProps {
  updateNewAddress: () => void; // Function type as a prop
  editData?: fetchedUserData;
  sethaschanges?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditdata?: React.Dispatch<React.SetStateAction<fetchedUserData | "">>;
  userData?: userDataprops | null;
}

interface fetchedDistricts {
  _id: string;
  districtName: string;
}
interface inputData {
  fullName: string;
  mobile: string;
  pincode: string;
  alterantiveNumber: string;
  address: string;
  addressType: string;
  districtId: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}

const NewAddress: React.FC<NewAddressProps> = ({
  updateNewAddress,
  sethaschanges,
  editData,
  setEditdata,
  userData,
}) => {
  const [fetchedDistricts, setFetchedDistricts] = useState<fetchedDistricts[]>(
    [],
  );
  const [inputData, setInputData] = useState<inputData>({
    fullName: "",
    mobile: "",
    pincode: "",
    alterantiveNumber: "",
    address: "",
    addressType: "",
    districtId: "",
    city: "",
    latitude: null,
    longitude: null,
  });
  console.log(inputData.latitude, "lattotude");
  console.log(inputData.longitude, "longitude");

  // handle change

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;

    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle save btn to add the address to DB

  const handleSave = async () => {
    const data = {
      userId: userData?._id,
      address: inputData.address,
      pincode: inputData.pincode,
      districtId: inputData.districtId,
      mobileNumber: inputData.mobile,
      alternateMobileNumber: inputData.alterantiveNumber,
      fullName: inputData.fullName,
      addressType: inputData.addressType,
      city: inputData.city,
      latitude: inputData.latitude,
      longitude: inputData.longitude,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/address/user`,
        data,
      );
      console.log(response.data);
      if (sethaschanges) {
        sethaschanges((prev) => !prev); // Correct way to update state
      }
      setInputData({
        fullName: "",
        mobile: "",
        pincode: "",
        alterantiveNumber: "",
        address: "",
        addressType: "",
        districtId: "",
        city: "",
        latitude: null,
        longitude: null,
      });
      updateNewAddress();
    } catch (error) {
      console.error(error);
    }
  };

  // handle update the address data

  const handleUpdate = async (_id: string) => {
    console.log(editData);

    console.log(_id, "update");

    const data = {
      userId: "67dbbcb0b24bfd96d2f74697",
      address: inputData.address,
      pincode: inputData.pincode,
      districtId: inputData.districtId,
      mobileNumber: inputData.mobile,
      alternateMobileNumber: inputData.alterantiveNumber,
      fullName: inputData.fullName,
      addressType: inputData.addressType,
      city: inputData.city,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/address/user/${_id}`,
        data,
      );
      console.log(response.data);
      if (sethaschanges) {
        sethaschanges((prev) => !prev); // Correct way to update state
      }
      setInputData({
        fullName: "",
        mobile: "",
        pincode: "",
        alterantiveNumber: "",
        address: "",
        addressType: "",
        districtId: "",
        city: "",
        latitude: null,
        longitude: null,
      });

      if (setEditdata) {
        setEditdata({
          _id: "",
          userId: "",
          address: "",
          pincode: "",
          createdAt: "",
          city: "",
          mobileNumber: "",
          alternateMobileNumber: "",
          fullName: "",
          addressType: "",
          districtId: "", // Fixed typo (was "dirstrictId")
        });
      }

      updateNewAddress();
    } catch (error) {
      console.error(error);
    }
  };

  // for get the current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInputData({
            ...inputData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  useEffect(() => {
    // it works when we trying to edit the current address
    if (editData) {
      setInputData({
        fullName: editData?.fullName || "",
        mobile: editData.mobileNumber || "",
        pincode: editData.pincode || "",
        alterantiveNumber: editData.alternateMobileNumber || "",
        address: editData.address || "",
        addressType: editData.addressType || "",
        districtId: editData.districtId || "",
        city: editData.city || "",
        latitude: null,
        longitude: null,
      });
    }

    // fetch the district
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/district`);
        console.log(response.data);
        setFetchedDistricts(response.data.data);
      } catch (error: any) {
        console.error("❌ Error fetching districts:", error.message);
      }
    };
    fetchDistrict();
  }, [editData]);

  return (
    <div className={styles.body}>
      <div className={styles.headMsg}>ADD A NEW ADDRESS</div>
      <div className={styles.currectLocationBtn} onClick={getLocation}>
        <div className={styles.icon}>
          <MdMyLocation />
        </div>
        <div className={styles.locationMsg}>Use my current location</div>
      </div>
      <div className={styles.inputrawSection}>
        <CustomInput
          label={"Full Name"}
          name={"fullName"}
          value={inputData.fullName}
          onchange={handleInputChange}
          placeholder={"full name"}
        />
        <CustomInput
          label={"Mobile"}
          name={"mobile"}
          value={inputData.mobile}
          onchange={handleInputChange}
          placeholder={"10-digits mobile number"}
        />
      </div>
      <div className={styles.inputrawSection}>
        <CustomInput
          label={"Pincode"}
          name={"pincode"}
          value={inputData.pincode}
          onchange={handleInputChange}
          placeholder={"pincode"}
        />
        <CustomInput
          label={"Alternate Phone"}
          name={"alterantiveNumber"}
          onchange={handleInputChange}
          value={inputData.alterantiveNumber}
          placeholder={"Alternate Phone(Optional)"}
        />
      </div>
      <div className={styles.textarea}>
        <TextField
          id="outlined-multiline-static"
          // label="Address"
          name="address"
          value={inputData.address}
          multiline
          minRows={3}
          sx={{ width: 455 }}
          placeholder="Address(Area and Street)"
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputrawSection}>
        <CustomInput
          label={"City/Town"}
          name={"city"}
          value={inputData.city}
          onchange={handleInputChange}
          placeholder={"City/Town"}
        />
        <DropDown
          districts={fetchedDistricts}
          name={"districtId"}
          value={inputData.districtId}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className={styles.inputrawSection}>
        {/* <CustomInput label={"LandMark"} placeholder={"LandMark(optional)"} /> */}
        {/* <CustomInput label={"Locality"} placeholder={"locality"} /> */}
      </div>
      <div className={styles.addressType}>
        <div className={styles.addressTypeName}>Address Type</div>
        <div className={styles.inputBoxSection}>
          <div className={`${styles.radio} `}>
            <input
              type="radio"
              name="addressType"
              value={"home"}
              checked={inputData.addressType === "home"}
              onChange={handleInputChange}
            />
            <p>Home</p>
          </div>
          <div className={styles.radio}>
            <input
              type="radio"
              name="addressType"
              value={"work"}
              checked={inputData.addressType === "work"}
              onChange={handleInputChange}
            />
            <p>Work</p>
          </div>
        </div>
      </div>
      <div className={styles.saveCancel}>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            editData?._id && editData._id.trim() !== ""
              ? handleUpdate(editData._id)
              : handleSave()
          }
        >
          Save
        </Button>

        <div className={styles.btnCancel} onClick={updateNewAddress}>
          <Button variant="text" size="medium">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAddress;
