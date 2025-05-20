import styles from "./Listing.module.css";
import SubNav from "./components/subNav/SubNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface fetchedDataProps {
  _id: string;
  mrp: number;
  sellingPrice: string;
  productDiscription: string;
  productTitle: string;
  colorId: string;
  colorName: number;
  fulfilmentBy: string;
  brandName: string;
  categoryName: string;
  productId: string;
  stockqty?: string;
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

const Listing: React.FC = () => {
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
        console.log(response.data, "sellerdata");
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/login"); // Redirect to login on error
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  // const sellerId = sellerData?;
  const [fetchedData, setfetchedData] = useState<fetchedDataProps[]>([]);

  // useeffect for fetch data from Product Variant
  useEffect(() => {
    const fetchProductVaraint = async () => {
      const sellerId = sellerData?._id;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productvaraint/fetchallproducts/${sellerId}`,
        );
        console.log(response.data.data);
        setfetchedData(response.data.data);
        const variantdata = response.data.data;
        const productVariantIds = variantdata.map(
          (productVariant: { _id: any }) => productVariant._id,
        ); // Use response directly
        if (productVariantIds.length > 0) {
          fetchProducstock(productVariantIds);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    // fetch the stock based on the Variant
    const fetchProducstock = async (productVariantIds: string[]) => {
      console.log("Fetching Variants from Product IDS:", productVariantIds);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/productstock/fetchstockByProductVariantId",
          { productVariantIds },
        );
        console.log("Fetched Product stock:", response.data);
        const stockdata = response.data.data;

        setfetchedData((prevSellers) =>
          prevSellers.map((product) => {
            const productVariant = stockdata.find(
              (stock: { productvariantId: string }) =>
                stock.productvariantId === product._id,
            );
            return {
              ...product,
              stockqty: productVariant?.stockqty || "No stockqty found",
            };
          }),
        );
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchProductVaraint();
  }, [sellerData]);

  // handle delete

  const handleDelete = async (productVaraintId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/productvaraint/${productVaraintId}`,
      );
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.subNav}>
        <SubNav
          addnewlisting={true}
          subnavName={"My Listing"}
          path={"/Seller/AddNewProductToListing"}
        />
      </div>
      <div className={styles.updatesSection}>
        <div className={styles.updatesBoxs}>
          <div className={styles.borderradius}>
            <div className={styles.activeBox}>
              <div className={styles.boxSection1}>0</div>
              <div className={styles.boxSection2}>Active Listings</div>
            </div>
            <div className={styles.activeBox}>
              <div className={styles.boxSection1}>0</div>
              <div className={styles.boxSection2}>Ready For Activation</div>
            </div>
            <div className={styles.activeBox}>
              <div className={styles.boxSection1}>0</div>
              <div className={styles.boxSection2}>Blocked Listings</div>
            </div>
            <div className={styles.activeBox}>
              <div className={styles.boxSection1}>0</div>
              <div className={styles.boxSection2}>Inactive Listing</div>
            </div>
          </div>
          <div className={styles.activeBoxm}>
            <div className={styles.boxSection1}>0</div>
            <div className={styles.boxSection2}>Archived Listings</div>
          </div>
        </div>
        <div className={styles.productdetails}>
          {/* <Table headnames={["Product Details","Listing Price","Final Price","Stock","Category","Fulfillment","Listing Quality","Additional Info","Action"]}/> */}
          <div className={styles.body}>
            <table>
              <thead>
                <tr className={styles.head}>
                  <th>0</th>
                  {/* {
        headnames.map((names, index) => (
          <th key={index}>{names}</th>
        ))
      } */}
                  <th>Product Name</th>
                  <th>MRP</th>
                  <th>Selling Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Fulfillment</th>
                  <th>Brand Name</th>
                  <th>Product Disc</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((item, index) => (
                  <tr className={styles.details}>
                    <th>{index + 1}</th>
                    <th>{item.productTitle}</th>
                    <th>{item.mrp}</th>
                    <th>{item.sellingPrice}</th>
                    <th>{item.stockqty}</th>
                    <th>{item.categoryName}</th>
                    <th>{item.fulfilmentBy}</th>
                    <th>{item.brandName}</th>
                    <th>{item.productDiscription}</th>
                    <th
                      className={styles.delete}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
