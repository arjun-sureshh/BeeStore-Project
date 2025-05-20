import { Route, Routes } from "react-router";
import ProductListing from "../pages/ProductListing/ProductListing";
import ProductView from "../pages/ProductDetails/ProductView";
import Cart from "../pages/Cart/Cart";
import MyProfile from "../pages/MyProfile/MyProfile";
import Home from "../pages/Home/Home";
import UserRegister from "../pages/userRegistration/UserRegistration";
import UserLogin from "../pages/userLogin/UserLogin";
import Orders from "../pages/orders/Orders";
import PlaceOrder from "../pages/placeOrder/PlaceOrder";

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProductView" element={<ProductView />} />
        <Route path="/ProductListing" element={<ProductListing />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/MyAccount" element={<MyProfile />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/Registration" element={<UserRegister />} />
        <Route path="/Login" element={<UserLogin />} />
        <Route path="/confirmOrder" element={<PlaceOrder />} />
      </Routes>
    </div>
  );
};

export default UserRoutes;
