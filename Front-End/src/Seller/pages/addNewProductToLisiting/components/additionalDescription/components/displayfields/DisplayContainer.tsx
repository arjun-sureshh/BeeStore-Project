import React, { useEffect, useState } from "react";
import styles from "./DisplayContainer.module.css";
import InputBox from "../../../components/inputbox/InputBox";
import { RootState } from "../../../../../../../redux/store";
import AddInput from "../../../components/addInput/AddInput";
import SearchKeywordManager from "../../../components/addsearchInput/AddSearchInput";
import AddSize from "../../../components/addForSize/AddSize";
import axios from "axios";
import Specification from "../../../components/addSpecification/AddSpecification";

type DisplayInputContainerProps = {
  inputRefs: Record<
    keyof RootState["toggle"]["productFields"],
    React.RefObject<HTMLInputElement>
  >;
};

interface fetchSizeHead {
  _id: string;
  sizeHeadName: string;
}

const DisplayContainer: React.FC<DisplayInputContainerProps> = ({
  inputRefs,
}) => {
  const [fetchColor, setfetchColor] = useState<fetchSizeHead[]>([]);

  useEffect(() => {
    const fetchSizeHead = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sizehead/");
        console.log(response.data);
        setfetchColor(response.data.data);
      } catch (error) {}
    };
    fetchSizeHead();
  }, []);

  return (
    <div className={styles.inputwholeContainer}>
      <InputBox
        type={"text"}
        headName={"Warranty Details"}
        attributeName={"Warranty Period"}
        ref={inputRefs["warrantyPeriod"]}
        name={"warrantyPeriod"}
        inputContain={""}
        required={""}
      />
      <InputBox
        type={"text"}
        headName={""}
        attributeName={"Waranty Summary"}
        ref={inputRefs["warantySummary"]}
        name={"warantySummary"}
        inputContain={"INR"}
        required={""}
      />
      <Specification
        type={"text"}
        headName={"Specificatipons"}
        attributeName={"Specification"}
        required={""}
      />
      <AddInput type={"text"} headName={"Key Features"} />
      <AddSize
        type={"text"}
        headName={"Size Info"}
        attributeName={"Size"}
        ref={inputRefs["sizebody"]}
        selectName={"sizeHeadId"}
        inputName={"sizebody"}
        inputContain={fetchColor}
        required={""}
      />
      <SearchKeywordManager
        type={"text"}
        headName={"Key Words"}
        attributeName={"Search Key Words"}
        required={""}
      />
    </div>
  );
};

export default DisplayContainer;
