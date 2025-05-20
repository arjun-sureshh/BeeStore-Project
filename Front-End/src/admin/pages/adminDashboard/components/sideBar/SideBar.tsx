import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { FaCogs, FaIndustry, FaShoppingCart, FaUsers } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  togglePageControl,
  toggleResetPage,
} from "../../../../../redux/toogleSlice";

const SideBar: React.FC = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) =>
    state.toggle.searchTerm.toLowerCase(),
  );
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const menuItems = [
    {
      title: "QC Department",
      icon: <FaCogs />,
      subItems: [
        { name: "Seller QC", page: "SellerQC" },
        { name: "Product QC", page: "ProductQC" },
      ],
    },
    {
      title: "Seller",
      icon: <FaShoppingCart />,
      subItems: [
        { name: "Active Seller", page: "ApprovedSeller" },
        { name: "Cancelled Seller", page: "RejectedSeller" },
      ],
    },
    {
      title: "Product",
      icon: <MdProductionQuantityLimits />,
      subItems: [
        { name: "Active Product", page: "ApprovedProducts" },
        { name: "Cancelled Product", page: "RejectedProducts" },
      ],
    },
    { title: "Customers", icon: <FaUsers />, page: "Customers" },
    { title: "District", page: "District" },
    { title: "Categories", page: "Categories" },
    { title: "Colours", page: "Color" },
    { title: "Brand", page: "Brand" },
    { title: "Size", page: "Size" },
    {
      title: "Policy",
      icon: <FaCogs />,
      subItems: [
        { name: "Payment Policy", page: "Payment" },
        { name: "Policy Methods", page: "Policy" },
      ],
    },
    {
      title: "Order Management",
      icon: <FaCogs />,
      subItems: [{ name: "Order Management", page: "OrderManagement" }],
    },
    { title: "Delivered Orders", page: "DeliveredOrders" }, // ✅ Added Delivered Orders
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(searchTerm);
    const matchesSubItems = item.subItems?.some((subItem) =>
      subItem.name.toLowerCase().includes(searchTerm),
    );
    return matchesTitle || matchesSubItems;
  });

  return (
    <div className={styles.body}>
      <div className={styles.title} onClick={() => dispatch(toggleResetPage())}>
        <div className={styles.webIcon}>
          <FaIndustry />
        </div>
        <div className={styles.webName}>Beestore</div>
      </div>
      <div className={styles.container}>
        <div className={styles.dropDownlist}>
          <ul className={styles.menu}>
            {filteredMenuItems.map((item) => (
              <li key={item.title}>
                {item.subItems ? (
                  <>
                    <div
                      className={styles.menu_item}
                      onClick={() => toggleMenu(item.title)}
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      {item.title}
                      <span className={styles.dropdown_icon}>
                        {openMenus[item.title] ? (
                          <IoMdArrowDropup />
                        ) : (
                          <IoMdArrowDropdown />
                        )}
                      </span>
                    </div>
                    {openMenus[item.title] && (
                      <ul className={styles.subMenu}>
                        {item.subItems
                          .filter((subItem) =>
                            subItem.name.toLowerCase().includes(searchTerm),
                          )
                          .map((subItem) => (
                            <li key={subItem.page}>
                              <span
                                onClick={() =>
                                  dispatch(togglePageControl(subItem.page))
                                }
                              >
                                {subItem.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div
                    className={styles.menu_item}
                    onClick={() => dispatch(togglePageControl(item.page))}
                  >
                    {item.icon && (
                      <span className={styles.icon}>{item.icon}</span>
                    )}
                    {item.title}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
