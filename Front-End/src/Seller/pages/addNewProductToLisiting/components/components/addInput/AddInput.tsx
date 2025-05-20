import React, { useEffect } from "react";
import styles from "./AddInput.module.css";
import InputField from "./components/InputField/InputField";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import {
  removeFeatureField,
  toggleFeatureAdd,
} from "../../../../../../redux/toogleSlice";

interface InputProps {
  headName?: string;
  type: string;
}

const AddInput: React.FC<InputProps> = ({ type, headName }) => {
  const dispatch = useDispatch();
  const features = useSelector((state: RootState) => state.toggle.features);
  console.log(features);

  const addFeatureField = () => {
    dispatch(toggleFeatureAdd({ title: "", content: "" }));
  };

  const removeFeature = (index: number) => {
    dispatch(removeFeatureField(index));
  };

  useEffect(() => {
    addFeatureField();
  }, []);

  return (
    <div className={styles.container}>
      {headName && <div className={styles.headName}>{headName}</div>}
      {features.map((feature, index) => (
        <div className={styles.subContainer}>
          <div className={styles.inputField}>
            <InputField feature={feature} index={index} type={type} />
          </div>
          <div
            className={styles.addButton}
            onClick={
              index === features.length - 1
                ? addFeatureField
                : () => removeFeature(index)
            }
          >
            {index === features.length - 1 ? <GoPlus /> : <FiMinus />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddInput;
