import React, { useState } from "react";
import styles from "./CheckBox.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CheckBoxProps {
  headname: string;
  checkboxname: string[];
  onChange: (selected: string[]) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  headname,
  checkboxname,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);

  const handleCheckboxChange = (name: string) => {
    const updatedSelected = selected.includes(name)
      ? selected.filter((item) => item !== name)
      : [...selected, name];
    setSelected(updatedSelected);
    onChange(updatedSelected);
  };

  return (
    <div className={styles.body}>
      <div
        className={styles.sectionTitle}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {headname} <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {isOpen &&
        checkboxname.map((name, index) => (
          <div className={styles.checkBoxContent} key={index}>
            <div className={styles.checkBox}>
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => handleCheckboxChange(name)}
              />
            </div>
            <div className={styles.checkBoxName}>{name}</div>
          </div>
        ))}
    </div>
  );
};

export default CheckBox;
