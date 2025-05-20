import React, { useEffect, useState } from "react";
import styles from "./adminDashboard.module.css";
import NavBar from "./components/navBar/NavBar";
import ContentArea from "./components/contentArea/ContentArea";
import Sidebar from "./components/sideBar/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const menuOpen = useSelector((state: RootState) => state.toggle.menuOpen);
  const token = sessionStorage.getItem("admin");
  const [adminData, setAdmindata] = useState<any>({});
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
        setAdmindata(response.data); // Set seller details in state
        console.log(response.data, "admindata");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/login"); // Redirect to login on error
      }
    };

    fetchAdmindata();
  }, [token]);

  return (
    <div className={styles.wrapper}>
      {menuOpen && (
        <div className={styles.sideBar}>
          <Sidebar />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.navbar}>
          <NavBar adminData={adminData} />
        </div>
        <div className={styles.content}>
          <ContentArea />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
