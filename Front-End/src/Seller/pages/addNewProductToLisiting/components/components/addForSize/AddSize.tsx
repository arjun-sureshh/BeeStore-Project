import React from "react";
import styles from "./AddSize.module.css";
import AttributeBox from "../attributeBox/AttributeBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { toggleProductFields } from "../../../../../../redux/toogleSlice";

interface InputBoxProps {
  type: string;
  headName?: string;
  attributeName: string;
  inputContain?: { _id: string; sizeHeadName: string }[]; // Made optional
  selectName: keyof RootState["toggle"]["productFields"];
  inputName: keyof RootState["toggle"]["productFields"];
  required: string;
}

// ✅ Use React.forwardRef with correct typing
const AddSize = React.forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      type,
      headName,
      attributeName,
      inputContain,
      inputName,
      selectName,
      required,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const selectValue = useSelector(
      (state: RootState) => state.toggle.productFields[selectName],
    );
    const inputValue = useSelector(
      (state: RootState) => state.toggle.productFields[inputName],
    );

    // Handler to update Redux state when the select value changes
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        toggleProductFields({ field: selectName, value: e.target.value }),
      );
    };

    return (
      <div className={styles.body}>
        {headName && <div className={styles.headName}>{headName}</div>}

        <div className={styles.attributeSection}>
          <AttributeBox attributeName={attributeName} requiredMust={required} />

          <div className={styles.input}>
            <input
              type={type}
              name={inputName}
              defaultValue={inputValue}
              ref={ref as React.Ref<HTMLInputElement>} // ✅ Ensure correct type
              onChange={(e) =>
                dispatch(
                  toggleProductFields({
                    field: inputName,
                    value: e.target.value,
                  }),
                )
              }
            />
          </div>

          {inputContain && (
            <div className={styles.inputContain}>
              <select
                name={selectName}
                defaultValue={selectValue} // controlled select value from Redux
                onChange={handleChange}
              >
                <option value="">Size</option>
                {inputContain.map((option, index) => (
                  <option
                    defaultValue={
                      typeof option === "string" ? option : option._id
                    }
                    key={index}
                  >
                    {typeof option === "string" ? option : option.sizeHeadName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  },
);

// ✅ Set display name for debugging
AddSize.displayName = "addSize";

export default AddSize;
