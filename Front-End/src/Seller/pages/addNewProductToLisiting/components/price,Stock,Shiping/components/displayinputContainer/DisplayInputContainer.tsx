import React from "react";
import styles from "./DisplayInputContainer.module.css";
import InputBox from "../../../components/inputbox/InputBox";
import SelectBox from "../../../components/selectBox/SelectBox";
import { RootState } from "../../../../../../../redux/store";

type DisplayInputContainerProps = {
  inputRefs: Record<
    keyof RootState["toggle"]["productFields"],
    React.RefObject<HTMLInputElement>
  >;
};

const DisplayInputContainer: React.FC<DisplayInputContainerProps> = ({
  inputRefs,
}) => {
  return (
    <div className={styles.inputwholeContainer}>
      <InputBox
        type={"text"}
        headName={"Listing information"}
        attributeName={"Seller SKU ID "}
        ref={inputRefs["skuId"]}
        name={"skuId"}
        inputContain={""}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={"Price details"}
        attributeName={"MRP"}
        ref={inputRefs["mrp"]}
        name={"mrp"}
        inputContain={"INR"}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Your selling price"}
        ref={inputRefs["sellingPrice"]}
        name={"sellingPrice"}
        inputContain={"INR"}
        required={"*"}
      />

      {/* <SelectBox headName={"Status Details"} attributeName={"Listing Status "} inputContain={["Active","Inactive"]} /> */}

      <SelectBox
        headName={"Inventory details"}
        attributeName={"Fullfilment by"}
        name={"fullfilementBy"}
        inputContain={["Seller"]}
        required={"*"}
      />
      <SelectBox
        headName={""}
        attributeName={"Procurement type "}
        name={"ProcurementType"}
        inputContain={[
          "Instock",
          "Express",
          "Domestic Procurement",
          "Made To Order",
        ]}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Procurement SLA"}
        ref={inputRefs["ProcurementSLA"]}
        name={"ProcurementSLA"}
        inputContain={"DAY"}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Stock"}
        ref={inputRefs["stock"]}
        name={"stock"}
        inputContain={""}
        required={"*"}
      />

      <SelectBox
        headName={""}
        attributeName={"Shipping provider"}
        name={"shippingProvider"}
        inputContain={["Beestore"]}
        required={"*"}
      />

      <InputBox
        type={"number"}
        headName={"Delivery charge to customer"}
        attributeName={"Local delivery charge "}
        ref={inputRefs["localDeliveryCharge"]}
        name={"localDeliveryCharge"}
        inputContain={"INR"}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Zonal delivery charge "}
        name={"ZonalDeliveryCharge"}
        ref={inputRefs["ZonalDeliveryCharge"]}
        inputContain={"INR"}
        required={"*"}
      />

      <InputBox
        type={"number"}
        headName={"Package details"}
        attributeName={"Length"}
        ref={inputRefs["length"]}
        name={"length"}
        inputContain={"CM"}
        required={""}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Breadth "}
        ref={inputRefs["breadth"]}
        name={"breadth"}
        inputContain={"CM"}
        required={""}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Height"}
        ref={inputRefs["height"]}
        name={"height"}
        inputContain={"CM"}
        required={""}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Weight "}
        ref={inputRefs["weight"]}
        name={"weight"}
        inputContain={"kG"}
        required={"*"}
      />

      <InputBox
        type={"text"}
        headName={"Tax details"}
        attributeName={"HSN"}
        ref={inputRefs["HSN"]}
        name={"HSN"}
        inputContain={""}
        required={"*"}
      />
      <SelectBox
        headName={""}
        attributeName={"Tax Code"}
        name={"taxCode"}
        inputContain={[
          "GST_0",
          "GST_12",
          "GST_18",
          "GST_28",
          "GST_3",
          "GST_5",
          "GST_APPAREL",
        ]}
        required={"*"}
      />
    </div>
  );
};

export default DisplayInputContainer;
