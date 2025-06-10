import React from "react";
import styles from "./PreviousAddress.module.css";
import LongMenu from "../../../MyProfile/components/contentArea/components/address/components/previousAddress/components/dotMenu/LongMenu";
import axios from "axios";

export interface fetchedUserData {
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
  districtId?: string;
}

interface previousAddressProps {
  fetchedAddress: fetchedUserData;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
  sethaschanges?: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit?: (id: string) => void;
}

const PreviousAddress: React.FC<previousAddressProps> = ({
  fetchedAddress,
  index,
  isSelected,
  onSelect,
  sethaschanges,
  onEdit,
}) => {
const API_URL = import.meta.env.VITE_API_URL;

  const onDelete = async (_id: string | undefined) => {
    if (!_id) return;
    try {
      const response = await axios.delete(
        `${API_URL}/api/address/${_id}`,
      );
      console.log(response.data);
      if (sethaschanges) {
        sethaschanges((prev) => !prev);
      }
    } catch (error) {
      console.error("deleteing error", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.section1}>
        <input
          type="radio"
          id={`address-${fetchedAddress._id || index}`}
          name="deliveryAddress"
          checked={isSelected || false}
          onChange={onSelect}
        />
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
          {fetchedAddress.address}, {fetchedAddress.city},{" "}
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
