import React, { useEffect, useState } from "react";
import styles from "./Address.module.css";
import { IoMdAdd } from "react-icons/io";
import PreviousAddress from "./components/previousAddress/PreviousAddress";
import NewAddress from "./components/addNewAddress/NewAddress";
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

interface Addressprops {
  userData?: userDataprops | null;
}

export interface userDataprops {
  _id?: string;
  userName?: string;
  userMobileNumber?: string;
  userEmail?: string;
  createdAt?: string;
  userGender?: string;
}

const Address: React.FC<Addressprops> = ({ userData }) => {
  const [newAddress, setNewAddress] = useState<boolean>(false);
  const [fetchedUserAddress, setFetchedUserAddress] = useState<
    fetchedUserData[]
  >([]);
  const [hasChanges, sethasChanges] = useState<boolean>(false);
  const [, setEditAddressId] = useState<string>("");
  const [editData, setEditData] = useState<fetchedUserData>({
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
    districtName: "",
    districtId: "",
  });

  const handleNewAddress = () => {
    setNewAddress((previous) => !previous);
    // Reset edit data when closing the form
    if (newAddress) {
      setEditAddressId("");
      setEditData({
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
        districtName: "",
        districtId: "",
      });
    }
  };

  const onEdit = async (_id: string) => {
    setEditAddressId(_id);
    handleNewAddress();

    try {
      const response = await axios.get(
        `http://localhost:5000/api/address/getAddress/${_id}`,
      );
      console.log(response.data);
      setEditData(response.data.data);
    } catch (error: any) {
      console.error("Fetching address details error", error);
    }
  };

  useEffect(() => {
    const fetchUserAddresses = async () => {
      const userId = userData?._id;
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/address/getByUserId/${userId}`,
        );
        console.log(response.data);
        setFetchedUserAddress(response.data.data);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
      }
    };
    fetchUserAddresses();
  }, [hasChanges, userData?._id]);

  return (
    <div className={styles.body}>
      <div>
        <div className={styles.headName}>Manage Addresses</div>
        {newAddress ? (
          <div className={styles.newAddress}>
            <NewAddress
              userData={userData}
              updateNewAddress={handleNewAddress}
              editData={editData}
              sethaschanges={sethasChanges}
            />
          </div>
        ) : (
          <div className={styles.addAddressSection} onClick={handleNewAddress}>
            <div className={styles.plusIcon}>
              <IoMdAdd />
            </div>
            <div className={styles.addMessage}>ADD A NEW ADDRESS</div>
          </div>
        )}
      </div>
      <div className={styles.previousAddress}>
        {fetchedUserAddress.length > 0 ? (
          fetchedUserAddress.map((addressdata, index) => (
            <PreviousAddress
              key={addressdata._id || index}
              fetchedAddress={addressdata}
              index={index}
              sethaschanges={sethasChanges}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className={styles.noAddressContainer}>
            <div className={styles.noAddressMessage}>No Addresses Found</div>
            <div className={styles.noAddressSubMessage}>
              You haven't added any addresses yet. Click Add A New Address To
              add one!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
