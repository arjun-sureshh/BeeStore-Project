import React, { useEffect, useState } from "react";
import styles from "./AddNewProductToListing.module.css";
import SubNav from "../mylisting/components/subNav/SubNav";
import ProductAddingSections from "./components/productAddingSection/ProductAddingSections";
import ProductPhoto from "./components/productPhoto/ProductPhoto";
import PriceAndStock from "./components/price,Stock,Shiping/PriceAndStock";
import ProductDescription from "./components/productDescription/ProductDescription";
import AdditionalDescription from "./components/additionalDescription/AdditionalDescription";
import AddPhoto from "./components/productPhoto/components/AddPhoto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SelectCategory from "./components/selectCategory/SelectCategory";
import SelectBrand from "./components/selectBrand/SelectBrand";
import axios from "axios";
import { toggleProductAddingState } from "../../../redux/toogleSlice";
import { useNavigate } from "react-router";

interface sellerData {
  _id: string;
  storeDiscription: string;
  sellerName: string;
  sellerMobileNumber: string;
  sellerGST: string;
  sellerEmail: string;
  sellerDisplayName: string;
  qcStatus: string;
  ifscCode: string;
  createdAt: string;
  bankAccountNo: string;
  ListingStatus?: string;
}

const AddNewProductToListing: React.FC = () => {
  const dispatch = useDispatch();

  const [displayphotoupload, setdisplayPhotoupload] = useState<Boolean>(false);
  const productAdddingState = useSelector(
    (state: RootState) => state.toggle.productAdddingState,
  );
  const productId = useSelector((state: RootState) => state.toggle.productId);
  const [saved, setSaved] = useState<boolean>(false);

  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState<sellerData>({
    _id: "",
    storeDiscription: "",
    sellerName: "",
    sellerMobileNumber: "",
    sellerGST: "",
    sellerEmail: "",
    sellerDisplayName: "",
    qcStatus: "",
    ifscCode: "",
    createdAt: "",
    bankAccountNo: "",
    ListingStatus: "",
  });

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const token = sessionStorage.getItem("seller");
      if (!token) {
        navigate("/SellerLanding"); // Redirect if no token found
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token, // Send token in header
          },
        });
        setSellerData(response.data); // Set seller details in state
        // console.log(response.data, "sellerdata");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/login"); // Redirect to login on error
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  // set the save btn
  const setSave = () => {
    setSaved(true);
  };
  // set usetate to display image block
  const displayimageBlock = () => {
    setdisplayPhotoupload(!displayphotoupload);
  };

  // useeffect for   fetch the productstage
  useEffect(() => {
    if (!productId) {
      dispatch(toggleProductAddingState(1)); // Handle the case when productId is null
      return;
    }

    const fetchProductStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${productId}`,
        );
        dispatch(
          toggleProductAddingState(response.data.productDetails.ListingStatus),
        );
        // console.log("fetch product id",productId);
        // console.log("listing stutus:",response.data.productDetails.ListingStatus);
      } catch (error: any) {
        console.error(
          "Error fetching product status:",
          error.response?.data || error.message,
        );
      }
    };

    fetchProductStatus();
  }, [productId]);

  return (
    <div className={styles.body}>
      <div className={styles.suNav}>
        <SubNav
          addnewlisting={true}
          subnavName={"Add a Single Listing"}
          path={"/Seller/AddNewProductToListing"}
        />
      </div>
      <div className={styles.productaddingnav}>
        <ProductAddingSections />
      </div>
      <div className={styles.productAddingContainer}>
        {productAdddingState === 1 && (
          <SelectCategory sellerId={sellerData?._id} />
        )}
        {productAdddingState === 2 && <SelectBrand />}

        {productAdddingState === 3 && (
          <>
            <div className={styles.photoSection}>
              {displayphotoupload ? (
                <AddPhoto
                  displyaimageblockFn={displayimageBlock}
                  setSave={setSave}
                  saved={saved}
                />
              ) : (
                <ProductPhoto
                  displyaimageblockFn={displayimageBlock}
                  saved={saved}
                />
              )}
            </div>
            <div className={styles.detailsSection}>
              <PriceAndStock />
              <ProductDescription />
              <AdditionalDescription />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewProductToListing;
