import React, { useState } from "react";
import styles from "./SelectCategory.module.css";
import {
  IconButton,
  InputBase,
  Paper,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { IoSearchCircleOutline } from "react-icons/io5";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleProductId } from "../../../../../redux/toogleSlice";

interface fetchData {
  categoryName: string;
  fullPath: string;
  _id: string;
}
interface selectCategoryProps {
  sellerId: string;
}

const SelectCategory: React.FC<selectCategoryProps> = ({ sellerId }) => {
  const dispatch = useDispatch();
  // const productId = useSelector((state: RootState) => state.toggle.productId); // fetch the productid from the redux
  const [searchData, setSearchData] = useState<string>("");
  const [fetchData, setFetchData] = useState<fetchData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Handle search input change and API call
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchData(value);

    if (value.trim() === "") {
      setFetchData([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/category/search/${value}`,
      );
      setFetchData(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Handle category selection
  const handleSelect = (category: fetchData) => {
    setSelectedCategory(category._id);
    setSearchData(category.fullPath); // Update input field with selected category
    setFetchData([]); // Hide dropdown after selection
  };

  const handleSubmit = async () => {
    const data = {
      sellerId: sellerId,
      categoryId: selectedCategory,
    };
    // console.log(productId);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/product`,
        data,
      ); // Send data directly
      // console.log("Product draft created:", response.data);
      const productid = response.data.product._id;
      dispatch(toggleProductId(""));
      setTimeout(() => dispatch(toggleProductId(productid)), 0); // Reinsert after a short delay
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Box className={styles.categoryContainer}>
      <Box className={styles.wrapper}>
        <Typography variant="h5" className={styles.title}>
          Select The Category For Your Product
        </Typography>
        <Typography variant="body1" className={styles.subTitle}>
          You can use the Search or Browse options
        </Typography>
        <Box className={styles.searchBar}>
          <Paper
            component="form"
            sx={{
              p: "4px 8px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 500,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "16px" }}
              placeholder="Search for a category..."
              inputProps={{ "aria-label": "search categories" }}
              onChange={handleChange}
              value={searchData}
            />
            <IconButton
              type="button"
              sx={{ p: "10px", color: "#007bff" }}
              aria-label="search"
            >
              <IoSearchCircleOutline size={24} />
            </IconButton>
          </Paper>
        </Box>

        {fetchData.map((category, index) => (
          <MenuItem key={index} onClick={() => handleSelect(category)}>
            {category.fullPath}
          </MenuItem>
        ))}
      </Box>

      {selectedCategory && (
        <Box className={styles.selectBrand}>
          <button
            className={styles.brandButton}
            type="button"
            onClick={handleSubmit}
          >
            Select Your Brand
          </button>
        </Box>
      )}
    </Box>
  );
};

export default SelectCategory;
