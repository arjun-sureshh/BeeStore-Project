import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddSearchInput.module.css"; // CSS Module for styles
import { RootState } from "../../../../../../redux/store";
import {
  toggleSearchKeyWordAdd,
  toggleSearchKeyWordFieldRemove,
} from "../../../../../../redux/toogleSlice";
import AttributeBox from "../attributeBox/AttributeBox";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import KeyWordInput from "./components/keyWordInput/KeyWordInput";

interface InputBoxProps {
  headName?: string;
  attributeName: string;
  required?: string;
  type?: string;
}

const SearchKeywordManager: React.FC<InputBoxProps> = ({
  type,
  headName,
  attributeName,
  required,
}) => {
  const dispatch = useDispatch();
  const searchKeyWords = useSelector(
    (state: RootState) => state.toggle.searchKeyWords,
  );
  console.log(searchKeyWords);

  // const handleAddKeyword = () => {
  //     if (newKeyword.trim() !== "") {
  //         dispatch(toggleSearchKeyWordAdd(newKeyword));
  //         setNewKeyword("");
  //     }
  // };

  const addSearchKeyWord = () => {
    dispatch(toggleSearchKeyWordAdd({ searchKeyWord: "" }));
  };

  // const handleUpdateKeyword = (index: number, value: string) => {
  //     dispatch(toggleSearchKeyWordsUpdate({ index, value }));
  // };

  const removeSearchKeyWord = (index: number) => {
    dispatch(toggleSearchKeyWordFieldRemove(index));
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
          {searchKeyWords.map((keyWord, index) => (
            <div className={styles.inputContainer}>
              <KeyWordInput
                searchKey={keyWord}
                index={index}
                inputType={type}
              />
              <button
                onClick={
                  index === searchKeyWords.length - 1
                    ? addSearchKeyWord
                    : () => removeSearchKeyWord(index)
                }
                className={styles.addButton}
              >
                {index === searchKeyWords.length - 1 ? <GoPlus /> : <FiMinus />}
              </button>
            </div>
          ))}

          {/* <ul className={styles.list}>
                        {searchKeyWords.map((keyword, index) => (
                            <li key={index} className={styles.listItem}>
                                <input
                                    type={type}
                                    value={keyword.searchKeyWord}
                                    onChange={(e) => handleUpdateKeyword(index, e.target.value)}
                                    className={styles.input}
                                />
                                <button
                                    onClick={() => dispatch(toggleSearchKeyWordFieldRemove(index))}
                                    className={styles.deleteButton}
                                >
                                    <FiMinus />
                                </button>
                            </li>
                        ))}
                    </ul> */}
        </div>
      </div>

      {/* Display the List of Keywords */}
    </div>
  );
};

export default SearchKeywordManager;
