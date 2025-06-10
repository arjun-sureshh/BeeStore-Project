import React, { useEffect, useState } from "react";
import styles from "./PlaceOrdewr.module.css";
import PreviousAddress from "./components/previousAddress/PreviousAddress";
import axios from "axios";
import PaymentOptions from "./components/paymentOptions/PaymentOption";

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

export interface existingUserData {
  userEmail: string;
  userMobileNumber: string;
  userName: string;
  _id: string;
}

interface BookingData {
  bookingId: string;
  amount: number;
  status: number;
  createdAt: string;
}

const PlaceOrder: React.FC = () => {
  const [fetchedUserAddress, setFetchedUserAddress] = useState<
    fetchedUserData[]
  >([]);
  const [existingUserData, setExistingUserData] =
    useState<existingUserData | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = sessionStorage.getItem("user");
      if (!token) {
        console.log("No user signed in");
        setExistingUserData(null);
        return;
      }

      try {
        const response = await axios.get<existingUserData>(
          `${API_URL}/api/Login`,
          {
            headers: { "x-auth-token": token },
          },
        );
        setExistingUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setExistingUserData(null);
        sessionStorage.removeItem("user");
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      const userId = existingUserData?._id;
      if (!userId) return;
      try {
        const response = await axios.get<{ data: fetchedUserData[] }>(
          `${API_URL}/api/address/getByUserId/${userId}`,
        );
        setFetchedUserAddress(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedAddressId(response.data.data[0]._id || "");
        }
      } catch (error) {
        console.error("Error fetching user addresses:", error);
      }
    };
    fetchUserAddresses();
  }, [existingUserData?._id]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const bookingID = sessionStorage.getItem("bookingID");
      if (!bookingID) {
        setError("No booking ID found. Please return to cart.");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${API_URL}/api/booking/getbyId`,
          {
            id: bookingID,
            userId: existingUserData?._id,
          },
        );
        if (response.data.success) {
          setBookingData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        console.error("Error fetching booking details:", error);
        setError("Failed to fetch booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [existingUserData]);

  return (
    <div className={styles.container}>
      {/* Logged-in User Display */}
      <div className={styles.sections}>
        <h3>Login</h3>
        <p>{existingUserData ? existingUserData.userName : "Not logged in"}</p>
      </div>

      {/* Delivery Address Section */}
      <div className={styles.sections}>
        <h3>Delivery Address</h3>
        {fetchedUserAddress.length > 0 ? (
          fetchedUserAddress.map((addressdata, index) => (
            <PreviousAddress
              key={addressdata._id || index}
              fetchedAddress={addressdata}
              index={index}
              isSelected={selectedAddressId === addressdata._id}
              onSelect={() => setSelectedAddressId(addressdata._id || "")}
            />
          ))
        ) : (
          <p>No addresses found. Please add a new address.</p>
        )}
      </div>

      {/* Booking Amount Section */}
      <div className={styles.sections}>
        <h3>Order Amount</h3>
        {loading ? (
          <p>Loading booking details...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : bookingData ? (
          <p>Total Amount: ${bookingData.amount}</p>
        ) : (
          <p>No booking details available.</p>
        )}
      </div>

      {/* Payment Options Section */}
      <div className={styles.sections}>
        <h3>Payment Options</h3>
        <PaymentOptions
          amount={bookingData?.amount}
          selectedAddressId={selectedAddressId}
          existingUser={existingUserData}
        />
      </div>
    </div>
  );
};

export default PlaceOrder;
