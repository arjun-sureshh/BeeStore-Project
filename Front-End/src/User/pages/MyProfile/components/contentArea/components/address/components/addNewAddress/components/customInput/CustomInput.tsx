import React from "react";
import styles from "./CustomInput.module.css";
import { TextField } from "@mui/material";

interface CustomInputProps {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onchange: (e: { target: { name: string; value: string } }) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  name,
  value,
  onchange,
}) => {
  return (
    <div className={styles.body}>
      <TextField
        id="outlined-textarea"
        name={name}
        value={value}
        label={label}
        onChange={onchange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomInput;
