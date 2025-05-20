import React from "react";
import styles from "./SideBar.module.css";
import YourActivites from "./components/yourActivities/YourActivites";
import { FaHouseUser, FaParachuteBox } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { ImNotification } from "react-icons/im";
import { FiLogOut } from "react-icons/fi";

interface SideBarProps {
  userName?: string;
}

const SideBar: React.FC<SideBarProps> = ({ userName }) => {
  return (
    <div className={styles.body}>
      <div className={styles.profileName}>{userName}</div>
      <div className={styles.sideBody}>
        <div className={styles.ddd}>
          <YourActivites
            headName={"My Order"}
            subName={[]}
            Link={"/User/Orders"}
            icon={<FaParachuteBox />}
            rightArrow={<IoIosArrowForward />}
          />
          <YourActivites
            headName={"Account Settings"}
            subName={["Profile Name", "Manage Addresses"]}
            Link={""}
            icon={<FaHouseUser />}
            rightArrow={null}
          />
          <YourActivites
            headName={"MY STUFF"}
            subName={[
              "My Reviews & Ratings",
              "All Notifications",
              "My Wishlist",
            ]}
            Link={""}
            icon={<ImNotification />}
            rightArrow={null}
          />
          <YourActivites
            headName={"Logout"}
            subName={[]}
            icon={<FiLogOut />}
            Link={""}
            rightArrow={null}
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
