import React from "react";
import styles from "./ContentArea.module.css";
import UserInformation from "./components/userInformation/UserInformation";
import Address from "./components/address/Address";
import Wishlist from "./components/wishlist/Wishlist";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

interface userDataprops {
  _id?: string;
  userName?: string;
  userMobileNumber?: string;
  userEmail?: string;
  createdAt?: string;
  userGender?: string;
}

interface ContentAreaprops {
  userData?: userDataprops | null;
}

const ContentArea: React.FC<ContentAreaprops> = ({ userData }) => {
  const openPageInUser = useSelector(
    (state: RootState) => state.toggle.openPageinUser || {},
  ); // ✅ Ensure it’s never undefined
  console.log(openPageInUser);

  return (
    <div className={styles.body}>
      {openPageInUser["Profile Name"] ? (
        <div className={styles.renderComponent}>
          <UserInformation userData={userData} />
        </div>
      ) : openPageInUser["Manage Addresses"] ? (
        <div className={styles.renderComponent}>
          <Address userData={userData} />
        </div>
      ) : (
        <div className={styles.renderComponent}>
          <Wishlist />
        </div>
      )}
    </div>
  );
};

export default ContentArea;
