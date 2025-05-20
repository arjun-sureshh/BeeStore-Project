import React, { useState, useEffect, useRef } from "react";
import styles from "./SubNav.module.css";
import AddNewList from "../addnewList/AddNewList";
import { MdKeyboardArrowDown } from "react-icons/md";
import Path from "../../../../../components/path/Path";

interface SubNavProps {
  addnewlisting: boolean;
  subnavName: string;
  path: string;
}

const SubNav: React.FC<SubNavProps> = ({ addnewlisting, subnavName, path }) => {
  const [handleaddListing, sethandleAddListing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside the container
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        sethandleAddListing(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.section1}>
        <Path />
      </div>
      <div className={styles.section2}>
        <div className={styles.listinHeadName}>{subnavName}</div>
        {addnewlisting && (
          <div className={styles.flex} ref={containerRef}>
            <div
              className={styles.addNewlisting}
              onClick={() => {
                sethandleAddListing(!handleaddListing);
              }}
            >
              Add New Listing <MdKeyboardArrowDown />
            </div>
            {handleaddListing && (
              <div className={styles.newlistDropdown}>
                <AddNewList linPath={path} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubNav;
