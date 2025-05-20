import React, { useEffect, useRef, useState } from "react";
import styles from "./AdditionalDescription.module.css";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RootState } from "../../../../../redux/store";
import DisplayContainer from "./components/displayfields/DisplayContainer";
import { useSelector } from "react-redux";

const AdditionalDescription: React.FC = () => {
  const [displayadddisc, setDisplayadddisc] = useState<Boolean>(false);
  const productFields = useSelector(
    (state: RootState) => state.toggle.productFields,
  );
  const [saved, setSaved] = useState<Boolean>(false);
  const [filledCount, setFilledCount] = useState<number>(0);

  // Store refs for each input field
  const inputRefs: Record<
    keyof RootState["toggle"]["productFields"],
    React.RefObject<HTMLInputElement>
  > = {
    mrp: useRef<HTMLInputElement>(null),
    fullfilementBy: useRef<HTMLInputElement>(null),
    ProcurementType: useRef<HTMLInputElement>(null),
    ProcurementSLA: useRef<HTMLInputElement>(null),
    sellingPrice: useRef<HTMLInputElement>(null),
    stock: useRef<HTMLInputElement>(null),
    shippingProvider: useRef<HTMLInputElement>(null),
    localDeliveryCharge: useRef<HTMLInputElement>(null),
    ZonalDeliveryCharge: useRef<HTMLInputElement>(null),
    length: useRef<HTMLInputElement>(null),
    breadth: useRef<HTMLInputElement>(null),
    height: useRef<HTMLInputElement>(null),
    weight: useRef<HTMLInputElement>(null),
    HSN: useRef<HTMLInputElement>(null),
    taxCode: useRef<HTMLInputElement>(null),
    countryOfOrigin: useRef<HTMLInputElement>(null),
    manufacturerDetails: useRef<HTMLInputElement>(null),
    packerDetails: useRef<HTMLInputElement>(null),
    skuId: useRef<HTMLInputElement>(null),
    productTitle: useRef<HTMLInputElement>(null),
    productDiscription: useRef<HTMLInputElement>(null),
    intheBox: useRef<HTMLInputElement>(null),
    minimumOrderQty: useRef<HTMLInputElement>(null),
    warantySummary: useRef<HTMLInputElement>(null),
    warrantyPeriod: useRef<HTMLInputElement>(null),
    searchKeyword: useRef<HTMLInputElement>(null),
    featureTitle: useRef<HTMLInputElement>(null),
    featureContent: useRef<HTMLInputElement>(null),
    color: useRef<HTMLInputElement>(null),
    sizebody: useRef<HTMLInputElement>(null),
    sizeHeadId: useRef<HTMLInputElement>(null),
    brandId: useRef<HTMLInputElement>(null),
    categoryId: useRef<HTMLInputElement>(null),
  };

  // required fields for the price and stock page
  const requiredFields: (keyof typeof productFields)[] = [
    "warrantyPeriod",
    "warantySummary",
    "searchKeyword",
    "featureTitle",
    "sizebody",
  ];

  useEffect(() => {
    const filledCount = requiredFields.filter(
      (key) => productFields[key],
    ).length;
    setFilledCount(filledCount);
  }, []);

  const handleSave = () => {
    const filledCount = requiredFields.filter(
      (key) => productFields[key],
    ).length;
    setFilledCount(filledCount);

    setSaved(true);
    setDisplayadddisc(!displayadddisc);
  };

  return (
    <div className={styles.body}>
      <div className={styles.titleSection}>
        <div className={styles.icon_title}>
          <div className={`${styles.icon} ${saved ? styles.iconSaved : ""}`}>
            <IoCheckmarkCircle />
          </div>
          <div className={styles.title}>
            Additional Describtion/Size Details (Optional) ({filledCount}/5)
          </div>
        </div>
        {displayadddisc ? (
          <div className={styles.flex}>
            <div
              className={styles.cancle}
              onClick={() => {
                setDisplayadddisc(!displayadddisc);
              }}
            >
              Cancel
            </div>
            <div className={styles.savebtn} onClick={handleSave}>
              Save
            </div>
          </div>
        ) : (
          <div
            className={styles.editBtn}
            onClick={() => {
              setDisplayadddisc(!displayadddisc);
            }}
          >
            Edit
          </div>
        )}
      </div>
      <div className={styles.errorSection}></div>
      {displayadddisc && (
        <div className={styles.displayInputContainer}>
          <DisplayContainer inputRefs={inputRefs} />
        </div>
      )}
    </div>
  );
};

export default AdditionalDescription;
