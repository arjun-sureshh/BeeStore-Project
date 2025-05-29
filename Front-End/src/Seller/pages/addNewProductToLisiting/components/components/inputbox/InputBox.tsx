import React from "react";
import styles from "./InputBox.module.css";
import AttributeBox from "../attributeBox/AttributeBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { toggleProductFields } from "../../../../../../redux/toogleSlice";

interface InputBoxProps {
  headName?: string;
  attributeName: string;
  inputContain?: string;
  name: keyof RootState["toggle"]["productFields"];
  required: string;
  type: string;
}

// ✅ Use React.forwardRef with correct typing
const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ type, headName, attributeName, inputContain, name, required }, ref) => {
    const dispatch = useDispatch();
    const value = useSelector(
      (state: RootState) => state.toggle.productFields[name],
    );

    return (
      <div className={styles.body}>
        {headName && <div className={styles.headName}>{headName}</div>}

        <div className={styles.attributeSection}>
          <AttributeBox attributeName={attributeName} requiredMust={required} />

          <div className={styles.input}>
            <input
              type={type}
              name={name}
              value={value}
              ref={ref as React.Ref<HTMLInputElement>} // ✅ Ensure correct type
              onChange={(e) =>
                dispatch(
                  toggleProductFields({ field: name, value: e.target.value }),
                )
              }
            />
          </div>

          {inputContain && (
            <div className={styles.inputContain}>{inputContain}</div>
          )}
        </div>
      </div>
    );
  },
);

// ✅ Set display name for debugging
InputBox.displayName = "InputBox";

export default InputBox;
