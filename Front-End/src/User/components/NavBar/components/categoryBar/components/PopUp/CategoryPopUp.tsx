// components/PopUp/CategoryPopUp.tsx
import React from "react";
import styles from "./CategoryPopUp.module.css";
import { Category } from "../../../../../types/types";
import { useNavigate } from "react-router-dom";

interface CategoryPopUpProps {
  subcategories: Category[];
}

const CategoryPopUp: React.FC<CategoryPopUpProps> = ({ subcategories }) => {
  const navigate = useNavigate();

  const handleClick = (categoryName: string) => {
    navigate("/User/ProductListing", { state: { categoryName } });
  };

  return (
    <div className={styles.popupContainer}>
      {subcategories.length === 0 ? (
        <div className={styles.noSubcategories}>No subcategories available</div>
      ) : (
        subcategories.map((subcategory) => (
          <div key={subcategory._id} className={styles.subcategoryColumn}>
            <h3
              className={styles.subcategoryTitle}
              onClick={() => handleClick(subcategory.categoryName)}
              style={{ cursor: "pointer" }}
            >
              {subcategory.categoryName}
            </h3>
            {subcategory.subcategories &&
              subcategory.subcategories.length > 0 && (
                <ul className={styles.nestedList}>
                  {subcategory.subcategories.map((nested) => (
                    <li
                      key={nested._id}
                      className={styles.nestedItem}
                      onClick={() => handleClick(nested.categoryName)}
                      style={{ cursor: "pointer" }}
                    >
                      {nested.categoryName}
                      {nested.subcategories &&
                        nested.subcategories.length > 0 && (
                          <ul className={styles.nestedList}>
                            {nested.subcategories.map((deepNested) => (
                              <li
                                key={deepNested._id}
                                className={styles.nestedItem}
                                onClick={() =>
                                  handleClick(deepNested.categoryName)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {deepNested.categoryName}
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryPopUp;
