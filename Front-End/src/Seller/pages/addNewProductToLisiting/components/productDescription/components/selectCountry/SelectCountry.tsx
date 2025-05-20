import React, { useState, useEffect } from "react";
import styles from "./SelectCountry.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import { toggleProductFields } from "../../../../../../../redux/toogleSlice";
import AttributeBox from "../../../components/attributeBox/AttributeBox";
import axios from "axios";

interface SelectBoxProps {
  headName?: string;
  attributeName: string;
  inputContain?: string[];
  name: keyof RootState["toggle"]["productFields"];
  isCountrySelect?: boolean;
  required?: string;
}

const SelectCountry: React.FC<SelectBoxProps> = ({
  headName,
  attributeName,
  inputContain = [],
  name,
  isCountrySelect = false,
  required,
}) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] =
    useState<string[]>(inputContain);
  const [, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const value = useSelector(
    (state: RootState) => state.toggle.productFields[name],
  );

  useEffect(() => {
    if (isCountrySelect) {
      axios
        .get("https://countriesnow.space/api/v0.1/countries/population/cities")
        .then((response) => {
          console.log(response.data);

          const countryNames = response.data
            .map((country: any) => country.name.common)
            .sort();

          setCountries(countryNames);
          setFilteredOptions(countryNames);
        })
        .catch((error) => console.error("Error fetching countries:", error));
    }
  }, [isCountrySelect]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = (isCountrySelect ? countries : inputContain).filter(
      (item) => item.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredOptions(filtered);
    setDropdownOpen(true);
  };

  const handleSelect = (option: string) => {
    dispatch(toggleProductFields({ field: name, value: option }));
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.body}>
      {headName && <div className={styles.headName}>{headName}</div>}
      <div className={styles.attributeSection}>
        <AttributeBox attributeName={attributeName} requiredMust={required} />

        {/* Search Box */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={handleSearch}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className={styles.searchInput}
          />

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className={styles.dropdownItem}
                    onMouseDown={() => handleSelect(option)}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCountry;
