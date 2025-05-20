import React from "react";
import styles from "./SideBar.module.css";
import PriceSlider from "./components/price/PriceSlider";
import CheckBox from "./components/checkBox/CheckBox";

interface SideBarProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
}

interface FilterState {
  priceRange?: [number, number];
  discounts?: string[];
  ratings?: string[];
}

const SideBar: React.FC<SideBarProps> = ({ onFilterChange }) => {
  return (
    <div className={styles.body}>
      <div className={styles.sideBarSection}>
        <div className={styles.sectionTitle}>Filters</div>
      </div>
      <div className={styles.sideBarSection}>
        <PriceSlider
          onChange={(range: any) => onFilterChange({ priceRange: range })}
        />
      </div>
      <div className={styles.sideBarSection}>
        <CheckBox
          headname="Discount"
          checkboxname={[
            "10% or more",
            "20% or more",
            "30% or more",
            "40% or more",
            "50% or more",
            "60% or more",
            "70% or more",
          ]}
          onChange={(selected: any) => onFilterChange({ discounts: selected })}
        />
      </div>
      <div className={styles.sideBarSection}>
        <CheckBox
          headname="Rating"
          checkboxname={[
            "4 stars & above",
            "3 stars & above",
            "2 stars & above",
          ]}
          onChange={(selected: any) => onFilterChange({ ratings: selected })}
        />
      </div>
    </div>
  );
};

export default SideBar;
