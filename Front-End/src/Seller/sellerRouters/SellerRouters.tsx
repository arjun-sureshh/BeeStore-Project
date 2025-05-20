import React from "react";
import { Route, Routes } from "react-router";
import SellerHomePage from "../pages/sellerHomePage/SellerHomePage";
import Listing from "../pages/mylisting/Listing";
import AddNewProduct from "../pages/addnewproduct/AddNewProduct";
import Inventory from "../pages/inventory/Inventory";
import AddNewProductToListing from "../pages/addNewProductToLisiting/AddNewProductToListing";
import CancelledProducts from "../pages/cancelledProducts/CancelledProducts";

const SellerRouters: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SellerHomePage />} />
        <Route path="/Listing" element={<Listing />} />
        <Route path="/AddNewProduct" element={<AddNewProduct />} />
        <Route
          path="/AddNewProductToListing"
          element={<AddNewProductToListing />}
        />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Cancelled-Products" element={<CancelledProducts />} />
      </Routes>
    </div>
  );
};

export default SellerRouters;
