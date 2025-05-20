import React, { useEffect, useState } from "react";
import styles from "./DisplayContainer.module.css";
import InputBox from "../../../components/inputbox/InputBox";
import { RootState } from "../../../../../../../redux/store";
import SelectCountry from "../selectCountry/SelectCountry";
import SelectBox from "../../../components/selectBox/SelectBox";
import axios from "axios";

type DisplayInputContainerProps = {
  inputRefs: Record<
    keyof RootState["toggle"]["productFields"],
    React.RefObject<HTMLInputElement>
  >;
};

interface fetchColor {
  _id: string;
  color: string;
}

const DisplayContainer: React.FC<DisplayInputContainerProps> = ({
  inputRefs,
}) => {
  const [fetchColor, setfetchColor] = useState<fetchColor[]>([]);

  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/color/");
        console.log(response.data);
        setfetchColor(response.data.data);
      } catch (error) {}
    };
    fetchColorData();
  }, []);

  return (
    <div className={styles.inputwholeContainer}>
      <InputBox
        type={"text"}
        headName={"Product Details"}
        attributeName={"Product Title"}
        ref={inputRefs["productTitle"]}
        name={"productTitle"}
        inputContain={""}
        required={"*"}
      />
      <InputBox
        type={"text"}
        headName={""}
        attributeName={"Product Discription"}
        ref={inputRefs["productDiscription"]}
        name={"productDiscription"}
        inputContain={""}
        required={"*"}
      />
      <InputBox
        type={"text"}
        headName={""}
        attributeName={"In The Box"}
        ref={inputRefs["intheBox"]}
        name={"intheBox"}
        inputContain={""}
        required={"*"}
      />
      <InputBox
        type={"number"}
        headName={""}
        attributeName={"Minimum OrderQty"}
        ref={inputRefs["minimumOrderQty"]}
        name={"minimumOrderQty"}
        inputContain={""}
        required={"*"}
      />

      <SelectCountry
        headName="Manufacturing Details"
        attributeName="Country Of Origin"
        name="countryOfOrigin"
        isCountrySelect={true}
        required={""}
      />

      <SelectBox
        headName={"Color Of Your Product"}
        attributeName={"Color"}
        name={"color"}
        inputContain={fetchColor}
        required={"*"}
      />

      <InputBox
        type={"text"}
        headName={""}
        attributeName={"Manufacturer Details"}
        ref={inputRefs["manufacturerDetails"]}
        name={"manufacturerDetails"}
        inputContain={""}
        required={"*"}
      />
      <InputBox
        type={"text"}
        headName={""}
        attributeName={"Packer Details"}
        ref={inputRefs["packerDetails"]}
        name={"packerDetails"}
        inputContain={""}
        required={"*"}
      />
    </div>
  );
};

export default DisplayContainer;
