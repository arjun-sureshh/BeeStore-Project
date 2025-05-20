import React, { useState } from "react";
import styles from "./CategoryBar.module.css";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdMenu } from "react-icons/md";

import CategoryPopUp from "./components/PopUp/CategoryPopUp";
import { staticCategories } from "./CategoryMenuName";

// Manually defined categories and subcategories

const CategoryBar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Handle category click for both desktop and mobile
  const handleCategoryClick = (index: number) => {
    if (activeCategory === index) {
      // If the same category is clicked, toggle popup visibility
      setPopupVisible((prev) => !prev);
      setActiveCategory(null);
    } else {
      // Open popup for the new category
      setActiveCategory(index);
      setPopupVisible(true);
    }
  };

  // Handle mouse leave for desktop popup
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setActiveCategory(null);
      setPopupVisible(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    // Close popup when toggling mobile menu
    setActiveCategory(null);
    setPopupVisible(false);
  };

  return (
    <div className={styles.categoryBar}>
      {/* Mobile Menu Toggle */}
      <div className={styles.mobileToggle} onClick={toggleMobileMenu}>
        <MdMenu size={24} />
        <span>Categories</span>
      </div>

      {/* Category Dropdown */}
      <div
        className={`${styles.categoryDropdown} ${
          isMobileMenuOpen ? styles.mobileOpen : ""
        }`}
      >
        {staticCategories.map((category, index) => (
          <div
            key={category._id}
            className={styles.categories}
            onClick={() => handleCategoryClick(index)}
            aria-label={`Category: ${category.categoryName}`}
          >
            {category.categoryName}
            {category.subcategories && category.subcategories.length > 0 && (
              <span className={styles.arrow}>
                {activeCategory === index && popupVisible ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Popup */}
      {popupVisible && activeCategory !== null && !isMobileMenuOpen && (
        <div className={styles.popUpSection} onMouseLeave={handleMouseLeave}>
          <CategoryPopUp
            subcategories={
              staticCategories[activeCategory]?.subcategories || []
            }
          />
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
