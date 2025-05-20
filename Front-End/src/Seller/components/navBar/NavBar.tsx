import React from "react";
import styles from "./NavBar.module.css";
import { NavDropdown } from "react-bootstrap";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("seller"); // Remove token from session storage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className={styles.body}>
      <div className={styles.section1}>
        <div className={styles.home}>
          <Link
            to="/Seller"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </Link>
        </div>
        <div className={styles.listing}>
          <NavDropdown title="Listing" id="basic-nav-dropdown">
            <NavDropdown.Item as="div">
              <Link
                to="/Seller/Listing"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                My Listing
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="div">
              <Link
                to="/Seller/AddNewProduct"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Add New listing
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
        <div className={styles.orders}>
          <NavDropdown title="Orders" id="basic-nav-dropdown">
            <NavDropdown.Item as="div">
              <Link
                to="/Seller/Inventory"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Inventory
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="div">
              <Link
                to="/Seller/Cancelled-Products"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Returns
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item as="div">
              <Link
                to="/Seller/Cancelled-Products"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Cancellation
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
        {/* <div className={styles.Payments}>
          <NavDropdown title="Payments" id="basic-nav-dropdown">
            <NavDropdown.Item as="div">My Listing</NavDropdown.Item>
            <NavDropdown.Item as="div">Add New listing</NavDropdown.Item>
            <NavDropdown.Item as="div">
              Track Approval Requests
            </NavDropdown.Item>
          </NavDropdown>
        </div> */}
      </div>
      <div className={styles.section2}>
        <div className={styles.logout} onClick={handleLogout}>
          <span className={styles.logoutIcons}>
            <IoLogOutOutline />
          </span>{" "}
          Log out
        </div>
      </div>
    </div>
  );
};

export default NavBar;
