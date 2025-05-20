import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddSpecification.module.css"; // CSS Module for styles
import { RootState } from "../../../../../../redux/store";
import {
  toggleSpecificationAdd,
  toggleSpecificationRemove,
} from "../../../../../../redux/toogleSlice";
import AttributeBox from "../attributeBox/AttributeBox";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import SpecificationInput from "./component/specificationInput/SpecificationInput";

interface InputBoxProps {
  headName?: string;
  attributeName: string;
  required?: string;
  type?: string;
}

const Specification: React.FC<InputBoxProps> = ({
  type,
  headName,
  attributeName,
  required,
}) => {
  const dispatch = useDispatch();
  const specification = useSelector(
    (state: RootState) => state.toggle.productSpecification,
  );
  console.log(specification);

  const addSearchKeyWord = () => {
    dispatch(toggleSpecificationAdd({ specification: "" }));
  };

  const removeSearchKeyWord = (index: number) => {
    dispatch(toggleSpecificationRemove(index));
  };

  useEffect(() => {
    addSearchKeyWord();
  }, []);

  return (
    <div className={styles.container}>
      {headName && <div className={styles.headName}>{headName}</div>}

      <div className={styles.attributeSection}>
        <AttributeBox attributeName={attributeName} requiredMust={required} />

        {/* Input Field for Adding New Keywords */}

        <div className={styles.inputsection}>
          {specification.map((keyWord, index) => (
            <div className={styles.inputContainer}>
              <SpecificationInput
                specification={keyWord}
                index={index}
                inputType={type}
              />
              <button
                onClick={
                  index === specification.length - 1
                    ? addSearchKeyWord
                    : () => removeSearchKeyWord(index)
                }
                className={styles.addButton}
              >
                {index === specification.length - 1 ? <GoPlus /> : <FiMinus />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display the List of Keywords */}
    </div>
  );
};

export default Specification;
