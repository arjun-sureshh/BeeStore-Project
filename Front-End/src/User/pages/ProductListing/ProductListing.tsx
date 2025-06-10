import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ProductListing.module.css";
import axios from "axios";
import ListingProduct, {
  ApiResponse,
  Product,
} from "./components/listing/ListingProduct";
import SideBar from "./components/sideBar/SideBar";
import { existingUserData } from "../../components/types/types";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface FilterState {
  priceRange?: [number, number];
  discounts?: string[];
  ratings?: string[];
}

const ProductListing = () => {
  const location = useLocation();
  const searchKeyword = location.state as string | undefined;
  const clickedCategory = sessionStorage.getItem("clickedCategoryId");
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store unfiltered products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Store filtered products
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const existingUser = sessionStorage.getItem("user");
  const [existingUserData, setexistingUserData] = useState<existingUserData>();
const API_URL = import.meta.env.VITE_API_URL;

  // Fetch products from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = searchKeyword
          ? await axios.post(
              `${API_URL}/api/product/bySearchKeyword`,
              { searchKeyword },
            )
          : await axios.post(
              `${API_URL}/api/product/ByTopCategory`,
              { clickedCategory },
            );

        console.log("API Response:", response.data);

        const productData: ApiResponse[] = response.data.data;
        const products =
          productData && productData.length > 0 ? productData[0].products : [];
        setAllProducts(products);
        setFilteredProducts(products); // Initially, no filters applied
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (searchKeyword || clickedCategory) {
      fetchProductDetails();
    }
  }, [clickedCategory, searchKeyword]);

  // fetch user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = existingUser;
      if (!token) {
        return console.log("user not signin");
      }
      try {
        const response = await axios.get(`${API_URL}/api/Login`, {
          headers: {
            "x-auth-token": token, // Send token in header
          },
        });
        console.log(response, "logeduser");
        // navigate("/User/");

        setexistingUserData(response.data); // Set seller details in state
      } catch (error) {
        console.error("Error fetching seller details:", error);
        // navigate("/SellerLanding"); // Redirect to login on error
      }
    };

    fetchUserDetails();

    // fetchProductDetails();
  }, []);

  // Apply client-side filters whenever filters or allProducts change
  useEffect(() => {
    let filtered = [...allProducts];

    // Price Range Filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(
        (product) =>
          product.sellingPrice >= minPrice && product.sellingPrice <= maxPrice,
      );
    }

    // Discount Filter
    if (filters.discounts?.length) {
      filtered = filtered.filter((product) => {
        const discountPercentage =
          product.mrp > 0
            ? Math.round(
                ((product.mrp - product.sellingPrice) / product.mrp) * 100,
              )
            : 0;
        return filters.discounts!.some((discount) => {
          const minDiscount = parseInt(discount.match(/\d+/)?.[0] || "0");
          return discountPercentage >= minDiscount;
        });
      });
    }

    // Rating Filter
    if (filters.ratings?.length) {
      filtered = filtered.filter((product) => {
        const avgRating = product.avgRating ?? 0;
        return filters.ratings!.some((rating) => {
          const minRating = parseInt(rating.match(/\d+/)?.[0] || "0");
          return avgRating >= minRating;
        });
      });
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className={styles.body}>
      <div className={styles.contentBody}>
        <div className={styles.sidBar}>
          <SideBar onFilterChange={handleFilterChange} />
        </div>
        <div className={styles.listing}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <ErrorOutlineIcon color="error" style={{ fontSize: 60 }} />
              <Typography variant="h6" color="error" mt={2}>
                {error}
              </Typography>
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <ErrorOutlineIcon color="disabled" style={{ fontSize: 60 }} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                No products available
              </Typography>
            </Box>
          ) : (
            <ListingProduct
              products={filteredProducts}
              loading={loading}
              error={error}
              existingUserData={existingUserData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
