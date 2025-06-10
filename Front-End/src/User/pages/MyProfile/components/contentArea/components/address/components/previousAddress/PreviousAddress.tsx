import React from "react";
import styles from "./PreviousAddress.module.css";
import LongMenu from "./components/dotMenu/LongMenu";
import axios from "axios";

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
  districtName?: string;
}


interface previousAddressProps {
  fetchedAddress: fetchedUserData;
  index: number;
  sethaschanges?: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit?: (id: string) => void;
}

const PreviousAddress: React.FC<previousAddressProps> = ({
  fetchedAddress,
  sethaschanges,
  onEdit,
}) => {

const API_URL = import.meta.env.VITE_API_URL;


  const onDelete = async (_id: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/address/${_id}`,
      );
      console.log(response.data);
      if (sethaschanges) {
        sethaschanges((prev) => !prev); // Correct way to update state
      }
    } catch (error: any) {
      console.error("deleteing error", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.section1}>
        <div className={styles.addressType}>{fetchedAddress.addressType}</div>
        <div className={styles.dots}>
          <LongMenu
            addressId={fetchedAddress._id}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>
      <div className={styles.section2}>
        <div className={styles.fullName}>{fetchedAddress.fullName}</div>
        <div className={styles.mobileNumber}>{fetchedAddress.mobileNumber}</div>
      </div>
      <div className={styles.section3}>
        <div className={styles.fullAddress}>
          {fetchedAddress.address},{fetchedAddress.city},
          {fetchedAddress.districtName}-District,
          <span className={styles.pinNo}>
            Kerala - {fetchedAddress.pincode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreviousAddress;
