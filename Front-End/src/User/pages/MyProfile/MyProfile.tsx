import React, { useEffect, useState } from "react";
import styles from "./MyProfile.module.css";
import SideBar from "./components/sideBar/SideBar";
import ContentArea from "./components/contentArea/ContentArea";
import axios from "axios";
import { existingUserData } from "../../components/types/types";

interface fetchedUserData {
  _id: string;
  userName: string;
  userMobileNumber: string;
  userEmail: string;
  createdAt: string;
  userGender?: string;
}

const MyProfile: React.FC = () => {
  const [fetchedUserData, setFetchedUserData] =
    useState<fetchedUserData | null>(null);

  const [, setExistingUserData] = useState<existingUserData | null>(null);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = sessionStorage.getItem("user");
      if (!token) {
        console.log("No user signed in");
        setExistingUserData(null);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log("Logged user response:", response.data);
        setExistingUserData(response.data);
        fetchedUser(response.data._id);
      } catch (error: any) {
        console.error("Error fetching user details:", {
          message: error.message,
          response: error.response?.data,
        });
        setExistingUserData(null);
        sessionStorage.removeItem("user");
      }
    };

    fetchUserDetails();
  }, []);

  const fetchedUser = async (UserId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/FetchDataByUserId/${UserId}`,
      );
      console.log(response.data);
      setFetchedUserData(response.data.data);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.sideBar}>
        <SideBar userName={fetchedUserData?.userName} />
      </div>
      <div className={styles.contentArea}>
        <ContentArea userData={fetchedUserData} />
      </div>
    </div>
  );
};
export default MyProfile;
