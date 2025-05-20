import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./AddNewProduct.module.css";
import SubNav from "../mylisting/components/subNav/SubNav";
import img from "../../../assets/lens.jpg";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  toggleProductId,
  toggleProductVaraintId,
} from "../../../redux/toogleSlice";
import { useNavigate } from "react-router";

interface fetchedDataProps {
  _id: string;
  ListingStatus: number;
  categoryName: string;
  brandName: string;
  updatedAt: string;
  createdAt: string;
  qcStatus: number;
  skuId: string;
}
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
const AddNewProduct: React.FC = () => {
  const dispatch = useDispatch();
  const [activateDelete, setActivateDelete] = useState<boolean>(false);
  // use navigation
  const navigate = useNavigate();

  const [fetchedData, setfetchedData] = useState<fetchedDataProps[]>([]);

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

  useLayoutEffect(() => {
    const fetchSellerDetails = async () => {
      const token = sessionStorage.getItem("seller");
      console.log(token);

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
        console.log(response.data, "sellerdata");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/login"); // Redirect to login on error
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  useEffect(() => {
    setActivateDelete(false);

    const fetchListingProduct = async () => {
      const sellerId = sellerData._id;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/fetchallproducts/${sellerId}`,
        );
        // console.log(response.data);
        setfetchedData(response.data.data);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchListingProduct();
  }, [activateDelete, sellerData]);

  // handle continue
  const handleContinue = async (_id: string) => {
    try {
      dispatch(toggleProductId(_id)); // Store product ID in Redux

      const response = await axios.get(
        `http://localhost:5000/api/productvaraint/fetchVaraintByProductId/${_id}`,
      );
      const productVariantId = response.data?.data?._id || ""; // Store variant ID or empty string if not found

      dispatch(toggleProductVaraintId(productVariantId)); // Store in Redux

      // Wait until Redux state updates before navigating
      setTimeout(() => {
        navigate("/Seller/AddNewProductToListing");
      }, 100);
    } catch (error) {
      console.error("Error fetching product variant:", error);

      // In case of an error, store an empty string in Redux and navigate
      dispatch(toggleProductVaraintId(""));

      setTimeout(() => {
        navigate("/Seller/AddNewProductToListing");
      }, 100);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/product/${productId}`,
      );
      console.log(response.data);
      setActivateDelete(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.subNav}>
        <SubNav
          addnewlisting={true}
          subnavName={"Add New Product"}
          path={"/Seller/AddNewProductToListing"}
        />
      </div>
      <div className={styles.secSection}>
        <div className={styles.headingSection}>
          <div className={styles.headName0}>Listing in Progress :</div>
          <div className={styles.headName1}>Single Listings</div>
          <div className={styles.headName2}>Bulk Listings</div>
        </div>
        <div className={styles.tableSection}>
          {fetchedData && fetchedData.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th>Updated On</th>
                  <th>Listing Improvement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((data, index) => (
                  <tr key={data._id || index}>
                    <td className={styles.imgTh}>
                      <div className={styles.imgInproductDetials}>
                        <img src={img} alt="Product" />
                      </div>
                      <div className={styles.productNamesec}>
                        <div className={styles.productName}>
                          {data.categoryName}
                        </div>
                        <div className={styles.SkU_IDSec}>
                          <span className={styles.SKU_ID}>
                            SKU_ID: {data.skuId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {data.qcStatus === 1
                        ? "Completed"
                        : data.ListingStatus <= 3
                          ? "Draft"
                          : "Qc In Progress"}
                    </td>
                    <td>
                      {new Date(data.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>
                      {new Date(data.updatedAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>
                      {data.ListingStatus <= 3
                        ? "Complete it & send for QC"
                        : "QC Progress"}
                    </td>
                    <td>
                      {data.qcStatus === 1 ? (
                        <div>dsc</div>
                      ) : data.ListingStatus <= 3 ? (
                        <div className={styles.Continue}>
                          <span onClick={() => handleContinue(data._id)}>
                            Continue
                          </span>{" "}
                          /{" "}
                          <span onClick={() => handleDelete(data._id)}>
                            {" "}
                            Delete
                          </span>
                        </div>
                      ) : (
                        <div>______ </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
