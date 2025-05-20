import React from "react";
import styles from "./KeyWordInput.module.css";
import { useDispatch } from "react-redux";
import { toggleSearchKeyWordsUpdate } from "../../../../../../../../redux/toogleSlice";

interface InputFieldProps {
  index: number;
  searchKey: any;
  inputType?: string;
}

const KeyWordInput: React.FC<InputFieldProps> = ({
  searchKey,
  inputType,
  index,
}) => {
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(toggleSearchKeyWordsUpdate({ index, value: value }));
  };

  return (
    <div className={styles.inputsection}>
      <div className={styles.inputContainer}>
        <input
          type={inputType}
          placeholder="Enter search keyword"
          defaultValue={searchKey?.searchKey || ""}
          name="searchKeyWord"
          onChange={handleChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default KeyWordInput;
