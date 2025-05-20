import React from "react";
import styles from "./AddNewList.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  toggleProductId,
  toggleProductVaraintId,
  toggleResetProductData,
} from "../../../../../redux/toogleSlice";

interface AddNewListProps {
  linPath: string;
}

const AddNewList: React.FC<AddNewListProps> = ({ linPath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addnewProduct = () => {
    dispatch(toggleProductId(""));
    dispatch(toggleProductVaraintId(""));
    dispatch(toggleResetProductData());
    navigate(linPath);
  };

  return (
    <div className={styles.body}>
      <div className={styles.singlelisting} onClick={addnewProduct}>
        {" "}
        Add A New Product
      </div>
    </div>
  );
};

export default AddNewList;
