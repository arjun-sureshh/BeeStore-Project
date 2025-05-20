import React from "react";
import styles from "./SpecificationInput.module.css";
import { useDispatch } from "react-redux";
import { toggleSpecificationUpdate } from "../../../../../../../../redux/toogleSlice";

interface InputFieldProps {
  index: number;
  specification: any;
  inputType?: string;
}


const SpecificationInput: React.FC<InputFieldProps> = ({
  specification,
  inputType,
  index,
}) => {
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(toggleSpecificationUpdate({ index, value: value }));
  };

  return (
    <div className={styles.inputsection}>
      <div className={styles.inputContainer}>
        <input
          type={inputType}
          placeholder="Enter Specification"
          defaultValue={specification?.searchKey || ""}
          name="specification"
          onChange={handleChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default SpecificationInput;
