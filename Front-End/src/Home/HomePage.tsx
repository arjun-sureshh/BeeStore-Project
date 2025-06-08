import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Navbar from "./components/navBar/Navbar";
import Banners from "./components/banner/Banners";
import BestProductLIst from "./components/bestProductslist/BestProductLIst";
import Footer from "../User/components/Footer/Footer";
import axios from "axios";
import { Product, CategoryGroup } from "./components/types";

interface CategoryData {
  categoryId: string;
  products: Product[];
}

const HomePage: React.FC = () => {
 const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<
    Record<string, CategoryData>
  >({
    Electronics: { categoryId: "", products: [] },
    Mobiles: { categoryId: "", products: [] },
    Fashion: { categoryId: "", products: [] },
    Furniture: { categoryId: "", products: [] },
    Appliances: { categoryId: "", products: [] },
  });
  const [recentlyLaunchedProducts, setRecentlyLaunchedProducts] = useState<
    Product[]
  >([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  useEffect(() =>{
    const fetchthedemo= async() =>{
      try {
        const response = await axios.get(
          `https://bee-store-api-server-side.vercel.app/api/product/test-demo`
        );
        console.log("demo",response);
        
      } catch (error) {
        console.error(error,"demo error");
        
      }
    }
    fetchthedemo();
  })
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://bee-store-api-server-side.vercel.app/api/product/grouped-by-category`
        );

        const productData: CategoryGroup[] = response.data.data || [];

        const newCategoriesData = { ...categoriesData };
        const otherProducts: Product[] = [];

        productData.forEach((category: CategoryGroup) => {
          const categoryName =
            category.categoryName === "Home & Furniture"
              ? "Furniture"
              : category.categoryName;

          const categoryInfo = {
            categoryId:
              category.categoryId ||
              `${categoryName}-${Math.random()}`, // Fallback ID
            products: category.products || [],
          };

          if (categoryName in newCategoriesData) {
            newCategoriesData[categoryName] = categoryInfo;
          } else {
            otherProducts.push(...categoryInfo.products);
          }
        });

        setCategoriesData(newCategoriesData);
        setRecentlyLaunchedProducts(otherProducts);
      } catch (error: any) {
        console.error("Error fetching products:", error);
      
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentlyViewed = async () => {
      try {
        const token = sessionStorage.getItem("user");
        if (!token) {
          setRecentlyViewed([]);
          return;
        }

        const response = await axios.get(`${API_URL}/api/userView`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentlyViewed(response.data.data || []);
      } catch (error: any) {
        console.error("Error fetching recently viewed products:", error);
        setRecentlyViewed([]);
      }
    };

    fetchProductsByCategory();
    fetchRecentlyViewed();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // if (error) {
  //   return <div className={styles.error}>{error}</div>;
  // }

  const categories = [
    {
      id: categoriesData.Electronics.categoryId,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
      id: categoriesData.Mobiles.categoryId,
      name: "Mobiles",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    },
    {
      id: categoriesData.Fashion.categoryId,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    },
    {
      id: categoriesData.Furniture.categoryId,
      name: "Furniture",
      image:
        "https://images.unsplash.com/photo-1680503397107-475907e4f3e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZ1cm5pdHVyZXN8ZW58MHx8MHx8fDA%3D",
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.navBar}>
        <Navbar />
      </div>
      <div className={styles.bannerSec}>
        <Banners />
      </div>
      <div className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Featured Categories</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              onClick={() => {
                sessionStorage.setItem("clickedCategoryId", category.id);
                navigate("/User/ProductListing");
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=Fallback+Image";
                }}
              />
              <div className={styles.categoryOverlay}>
                <h3>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.productListing}>
        {recentlyViewed.length > 0 && (
          <BestProductLIst
            title="Recently Viewed Products"
            products={recentlyViewed}
            topcategoryId=""
          />
        )}
        {categoriesData.Electronics.products.length > 0 && (
          <BestProductLIst
            title="Top Electronics"
            products={categoriesData.Electronics.products}
            topcategoryId={categoriesData.Electronics.categoryId}
          />
        )}
        {categoriesData.Mobiles.products.length > 0 && (
          <BestProductLIst
            title="Top Mobiles"
            products={categoriesData.Mobiles.products}
            topcategoryId={categoriesData.Mobiles.categoryId}
          />
        )}
        {categoriesData.Fashion.products.length > 0 && (
          <BestProductLIst
            title="Top Fashion"
            products={categoriesData.Fashion.products}
            topcategoryId={categoriesData.Fashion.categoryId}
          />
        )}
        {categoriesData.Furniture.products.length > 0 && (
          <BestProductLIst
            title="Top Furniture"
            products={categoriesData.Furniture.products}
            topcategoryId={categoriesData.Furniture.categoryId}
          />
        )}
        {categoriesData.Appliances.products.length > 0 && (
          <BestProductLIst
            title="Top Appliances"
            products={categoriesData.Appliances.products}
            topcategoryId={categoriesData.Appliances.categoryId}
          />
        )}
        {recentlyLaunchedProducts.length > 0 && (
          <BestProductLIst
            title="Recently Launched Items"
            products={recentlyLaunchedProducts}
            topcategoryId=""
          />
        )}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;