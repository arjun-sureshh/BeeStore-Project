import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { BsCart4, BsShop } from "react-icons/bs";
import HoverDown from "./components/hoverDown/HoverDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { togglePageControlInUser } from "../../../redux/toogleSlice";
import axios from "axios";

const Navbar: React.FC = () => {
  const [handledownoption, sethandledownoption] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("user");
  const location = useLocation();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/search/suggestions`,
          {
            params: { query: searchQuery },
          },
        );
        setSuggestions(response.data.suggestions || []);
        console.log(response);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const gotoWishlist = () => {
    if (!token) {
      return navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }
    dispatch(togglePageControlInUser("My Wishlist"));
    navigate("/User/MyAccount");
  };

  const handleCartClick = (e: { preventDefault: () => void }) => {
    console.log("cartlog", token);

    if (!token) {
      e.preventDefault(); // Prevent Link navigation
      navigate(
        `/User/Login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }
    // If token exists, Link will navigate to /User/Cart
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      navigate("/User/ProductListing", { state: suggestions[0] });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchQuery(suggestion);
    try {
      navigate("/User/ProductListing", { state: suggestion });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.sections}>
        <div className={styles.webName}>BeeStore</div>
      </div>
      <div className={styles.sections}>
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className={styles.searchIcon}>
            <FaSearch />
          </button>
          {suggestions.length > 0 && (
            <div className={styles.suggestionDropdown}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      <div className={styles.sections}>
        <div
          className={styles.loginReg}
          onMouseEnter={() => sethandledownoption(true)}
          onMouseLeave={() => sethandledownoption(false)}
        >
          <div className={styles.logcon}>
            <span className={styles.navIcons}>
              <FaRegUser />
            </span>
            <span className={styles.flex}>
              {!token && <div className={styles.log}>Log In</div>}
              <div className={styles.reg}>My Account</div>
            </span>
          </div>
          {handledownoption && (
            <div className={styles.newlistDropdown}>
              <HoverDown />
            </div>
          )}
        </div>
        <div className={styles.wishList} onClick={gotoWishlist}>
          <span className={styles.navIcons}>
            <FiHeart />
          </span>
          <span className={styles.whilistName}>Wishlist</span>
        </div>
        <div className={styles.cart}>
          <Link
            to="/User/Cart"
            className={styles.cartLink}
            onClick={handleCartClick}
          >
            <span className={styles.navIcons}>
              <BsCart4 />
            </span>
            Cart
          </Link>
        </div>
        <Link to="/SellerLanding" className={styles.becomeSeller}>
          <span className={styles.navIcons}>
            <BsShop />
          </span>
          Become a Seller
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
