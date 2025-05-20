import React from "react";
import styles from "./DropDown.module.css";

interface SingleSelectProps {
  districts: { _id: string; districtName: string }[];
  name: string;
  value: string;
  handleInputChange: (e: { target: { name: string; value: string } }) => void;
}

const DropDown: React.FC<SingleSelectProps> = ({
  districts,
  name,
  value,
  handleInputChange,
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    // Wrapping in the expected object format
    handleInputChange({ target: { name, value } });
  };

  return (
    <div className={styles.body}>
      <div className={styles.attributeSection}>
        {/* <AttributeBox attributeName={attributeName}  requiredMust={required}/> */}
        <div className={styles.select}>
          <select
            name={name}
            value={value}
            // defaultValue={value} // controlled select value from Redux
            onChange={handleSelectChange}
          >
            <option value="">Select One</option>
            {districts.map((option, index) => (
              <option
                value={typeof option === "string" ? option : option._id}
                key={index}
              >
                {typeof option === "string" ? option : option.districtName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
