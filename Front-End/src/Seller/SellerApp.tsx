import React, { useEffect, useState } from "react";
import styles from "./SellerApp.module.css";
import { Link, useNavigate } from "react-router-dom";
import SellerLogin from "./pages/sellerLogin/SellerLogin";
import axios from "axios";

const SellerApp: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const token = sessionStorage.getItem("seller");
      if (!token) {
        navigate("/SellerLanding");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log(response);

        navigate("/Seller/");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        navigate("/SellerLanding");
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  return (
    <div
      className={styles.container}
      style={{
        // Background with gradient and alternative Unsplash image
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1556740749-88778e9e9b1b") no-repeat center center/cover`,
        backgroundColor: "#1a1a1a", // Fallback color if image fails to load
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundSize: "cover", // Ensure image covers the container
        backgroundPosition: "center center", // Center the image
      }}
    >
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>BeeStore</div>
        <ul className={styles.navLinks}>
          <li>
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
          </li>
          <li>About</li>
          <li>Pricing</li>
          <li>Contact</li>
          <li>
            <button
              className={styles.sellerButton}
              onClick={() => setShowLogin(true)}
            >
              Seller Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Sell Your Products with Ease</h1>
          <p>
            Join thousands of sellers growing their business on our platform.
          </p>
          <Link to={"/Seller/Registration"}>
            <button className={styles.registerButton}>Start Selling</button>
          </Link>
        </div>
      </section>

      {showLogin && <SellerLogin onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default SellerApp;
