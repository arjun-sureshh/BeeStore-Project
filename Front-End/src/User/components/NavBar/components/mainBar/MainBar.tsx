import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MainBar.module.css";
import axios from "axios";
import { FiHeart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { togglePageControlInUser } from "../../../../../redux/toogleSlice";

const MainBar = () => {
  const existingUser = sessionStorage.getItem("user");
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [suggestions, setSuggestions] = useState<string[]>([]); // State for suggestions
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false); // State for mobile search toggle
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Fetch suggestions when searchQuery changes
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
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission (search)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/User/ProductListing", { state: suggestions[0] });
      setSuggestions([]);
      setIsSearchOpen(false); // Close search bar on mobile after submission
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate("/User/ProductListing", { state: suggestion });
    setSuggestions([]);
    setIsSearchOpen(false); // Close search bar on mobile after clicking suggestion
  };

  // Toggle search bar on mobile
  const gotoWishlist = () => {
    dispatch(togglePageControlInUser("My Wishlist"));
    navigate("/User/MyAccount");
  };

  return (
    <div>
      <div className={styles.flipSearchBar}>
        <div className={styles.wholeBar}>
          <div className={styles.flipkart}>
            <div className={styles.kartName}>
              <div className={styles.name1}>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontFamily: "cursive",
                  }}
                  to={"/"}
                >
                  BeeStore
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar (Hidden on mobile by default, toggled by icon) */}
          <div
            className={`${styles.searchBar} ${isSearchOpen ? styles.searchBarOpen : ""}`}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{ width: "100%", position: "relative" }}
            >
              <div className="d-flex">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button type="submit" className={styles.searchIcon}>
                  <FaSearch />
                </button>
              </div>
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

          {/* Other Links */}
          {!existingUser && (
            <div className={styles.login}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/User/Login"}
              >
                Login
              </Link>
            </div>
          )}
          <div className={styles.becomeSeller}>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/SellerLanding"}
            >
              Become a Seller
            </Link>
          </div>
          {existingUser && (
            <div className={styles.options}>
              <div className={styles.whishlist} onClick={gotoWishlist}>
                Wishlist <FiHeart />
              </div>
              <div className={styles.Orders}>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/User/Orders"
                >
                  Orders
                </Link>
              </div>
            </div>
          )}
          {existingUser && (
            <div className={styles.cart}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to="/User/Cart"
              >
                <FaCartShopping /> Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainBar;
