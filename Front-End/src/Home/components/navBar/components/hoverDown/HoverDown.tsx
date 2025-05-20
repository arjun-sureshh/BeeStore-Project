import React from "react";
import styles from "./HoverDown.module.css";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router";

const HoverDown: React.FC = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("user");
  const location = useLocation();

  const handleClick = (e: { preventDefault: () => void }) => {
    if (!token) {
      e.preventDefault(); // Prevent Link navigation
      navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }
    // If token exists, Link will navigate to /User/Cart
  };
  return (
    <div className={styles.body}>
      {!token && (
        <div className={styles.signInUP}>
          <span className={styles.signIn}>
            {" "}
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/User/Login"}
            >
              SignIn
            </Link>
          </span>
          <span className={styles.signup}>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/User/Registration"}
            >
              {" "}
              SignUp{" "}
            </Link>
          </span>
        </div>
      )}
      <div className={styles.subBody}>
        <div className={styles.suboptions}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={handleClick}
            to={"/User/MyAccount"}
          >
            {" "}
            <FaRegCircleUser /> My Profile{" "}
          </Link>
        </div>
        <div className={styles.suboptions}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={handleClick}
            to={"/User/Orders"}
          >
            {" "}
            <LuBox /> Orders{" "}
          </Link>
        </div>
        {/* <div className={styles.suboptions}></div> */}
      </div>
    </div>
  );
};

export default HoverDown;
