import React, { useEffect, useState } from "react";
import styles from "./Inventory.module.css";
import Path from "../../../components/path/Path";
import axios from "axios";
import { useNavigate } from "react-router";

interface fetchedDataProps {
  _id: string;
  mrp: number;
  sellingPrice: string;
  productDiscription: string;
  productTitle: string;
  colorId: string;
  colorName: string;
  fulfilmentBy: string;
  brandName: string;
  categoryName: string;
  productId: string;
  stockqty?: number;
  image?: string;
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

const Inventory: React.FC = () => {
  const [fetchedData, setFetchedData] = useState<fetchedDataProps[]>([]);
  const [addStock, setAddStock] = useState<{ [key: string]: boolean }>({});
  const [stockInput, setStockInput] = useState<string>("");
  const [inventoryCounts, setInventoryCounts] = useState<{
    all: number;
    lowStock: number;
    outOfStock: number;
  }>({ all: 0, lowStock: 0, outOfStock: 0 });
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";
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
        navigate("/SellerLanding");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/Login", {
          headers: {
            "x-auth-token": token,
          },
        });
        setSellerData(response.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerDetails();
  }, [navigate]);

  useEffect(() => {
    const fetchProductVariant = async () => {
      const sellerId = sellerData._id;

      if (!sellerId) {
        // navigate("/SellerLanding");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/productvaraint/fetchallproducts-for-Inventory/${sellerId}`,
        );
        setFetchedData(response.data.data);
        // console.log(response);

        setInventoryCounts((prev) => ({
          ...prev,
          all: response.data.data.length,
        }));
      } catch (error: any) {
        console.log(error);
      }
    };

    const fetchLowStock = async () => {
      const sellerId = sellerData._id;
      if (!sellerId) {
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/productvaraint/fetchallproducts-for-low-stock/${sellerId}`,
        );
        setInventoryCounts((prev) => ({
          ...prev,
          lowStock: response.data.count,
        }));
      } catch (error: any) {
        console.error("Error fetching low stock:", error);
      }
    };

    const fetchOutOfStock = async () => {
      const sellerId = sellerData._id;
      if (!sellerId) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/productvaraint/fetchallproducts-for-out-of-stock/${sellerId}`,
        );
        setInventoryCounts((prev) => ({
          ...prev,
          outOfStock: response.data.count,
        }));
      } catch (error: any) {
        console.error("Error fetching out of stock:", error);
      }
    };

    fetchProductVariant();
    fetchLowStock();
    fetchOutOfStock();
  }, [sellerData, addStock]);

  const handleAddStock = async (variantId: string) => {
    if (!stockInput) {
      console.log("Missing product stock");
      return;
    }
    if (!variantId) {
      console.log("Missing Product Variant ID");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/productstock/AddStock/${variantId}`,
        {
          stockqty: stockInput,
        },
      );
      setAddStock((prev) => ({ ...prev, [variantId]: false }));
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleFilter = async (type: "all" | "lowStock" | "outOfStock") => {
    const sellerId = sellerData._id;
    if (!sellerId) return;

    try {
      let url = `http://localhost:5000/api/productvaraint/fetchallproducts-for-Inventory/${sellerId}`;
      if (type === "lowStock") {
        url = `http://localhost:5000/api/productvaraint/fetchallproducts-for-low-stock/${sellerId}`;
      } else if (type === "outOfStock") {
        url = `http://localhost:5000/api/productvaraint/fetchallproducts-for-out-of-stock/${sellerId}`;
      }
      const response = await axios.get(url);
      setFetchedData(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${type} products:`, error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.headSection}>
        <div className={styles.titleSec}>
          <Path />
          <div className={styles.title}>Inventory</div>
        </div>
        <div className={styles.btnSec}>
          <div className={styles.btns}>
            <div className={styles.btnblock}>
              <div className={styles.btn} onClick={() => handleFilter("all")}>
                <div className={styles.inbtn1}>All Inventory</div>
                <div className={styles.inbtn2}>{inventoryCounts.all}</div>
              </div>
              <div
                className={styles.btn}
                onClick={() => handleFilter("lowStock")}
              >
                <div className={styles.inbtn1}>Low Stock</div>
                <div className={styles.inbtn2}>{inventoryCounts.lowStock}</div>
              </div>
              <div
                className={styles.btn}
                onClick={() => handleFilter("outOfStock")}
              >
                <div className={styles.inbtn1}>Out Of Stock</div>
                <div className={styles.inbtn2}>
                  {inventoryCounts.outOfStock}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.productdetailSec}>
        <div className={styles.tableContainer}>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.headerRow}`}>
              <div className={styles.indexCell}>#</div>
              <div className={styles.cell}>Product Name</div>
              <div className={styles.cell}>Current Stock</div>
              <div className={styles.cell}>Action</div>
            </div>

            {fetchedData.length > 0 ? (
              fetchedData.map((data, index) => (
                <div className={styles.row} key={data._id}>
                  <div className={styles.indexCell}>{index + 1}</div>
                  <div className={styles.cell}>
                    <div className={styles.imgInproductDetials}>
                      <img
                        src={`${baseUrl}${data.image}` || "/image.jpg"}
                        alt="Product"
                      />
                    </div>
                    <div className={styles.productTitle}>
                      {data.productTitle}
                    </div>
                  </div>
                  <div className={styles.cell}>
                    {data.stockqty ?? "No stock"}
                  </div>
                  <div className={styles.cell}>
                    <div
                      className={styles.addStock}
                      onClick={() =>
                        setAddStock((prev) => ({
                          ...prev,
                          [data._id]: !prev[data._id],
                        }))
                      }
                    >
                      Add Stock
                    </div>
                    {addStock[data._id] && (
                      <div className={styles.inputAddStock}>
                        <input
                          type="number"
                          onChange={(e) => setStockInput(e.target.value)}
                          min="0"
                        />
                        <span
                          className={styles.btnAdd}
                          onClick={() => handleAddStock(data._id)}
                        >
                          Add
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData}>No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
