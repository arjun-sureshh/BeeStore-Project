import React, { useEffect, useState } from "react";
import styles from "./ApprovedProducts.module.css";
import axios from "axios";

// Define TypeScript interfaces for our data

interface fetchedDataProps {
  _id: string;
  sellerName: string;
  sellerId: string;
  categoryName: string;
  brandName: string;
  fulfilmentBy: string;
  skuId: string;
  zonalDeliveryCharge: string;
  localDeliveryCharge: string;
  createdAt: string;
  updatedAt: string;
  productVariantId?: string;
  Length?: string;
  breadth?: string;
  weight?: string;
  height?: string;
  countryOfOrgin?: string;
  hsnCode?: string;
  intheBox?: string;
  manufactureDetails?: string;
  minimumOrderQty?: string;
  mrp?: string;
  packerDetails?: string;
  procurementSLA?: string;
  procurementType?: string;
  productDiscription?: string;
  productTitle?: string;
  sellingPrice?: string;
  shippingProvider?: string;
  taxCode?: string;
  warantySummary?: string;
  warrantyPeriod?: string;
  colorName?: string;
  stockqty?: string;
}

const ApprovedProduct: React.FC = () => {
  const [fetchedData, setfetchedData] = useState<fetchedDataProps[]>([]);
  const [approved, setSetApproved] = useState<boolean>(false);

  // useeffect for fetch the seller details

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/ApprovedProducts",
        );
        console.log("Fetched Sellers:", response.data.data);

        setfetchedData(response.data.data); // Update state

        const productIds = response.data.data.map(
          (product: { _id: any }) => product._id,
        ); // Use response directly
        if (productIds.length > 0) {
          fetchProductVariant(productIds);
        }
      } catch (error: any) {
        console.error("Error fetching sellers:", error);
      }
    };

    // fetch the address of the seller
    const fetchProductVariant = async (productIds: string[]) => {
      console.log("Fetching Variants from Product IDS:", productIds);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/productvaraint/fetchVariantByProductId",
          { productIds },
        );
        console.log("Fetched Product Variant:", response.data);
        const variantdata = response.data.data;

        setfetchedData((prevSellers) =>
          prevSellers.map((product) => {
            const productVariant = variantdata.find(
              (variant: { productId: string }) =>
                variant.productId === product._id,
            );
            return {
              ...product,
              Length: productVariant?.Length || "No Length found",
              breadth: productVariant?.breadth || "No breadth found",
              weight: productVariant?.weight || "No weight found",
              height: productVariant?.height || "No height found",
              countryOfOrgin:
                productVariant?.countryOfOrgin || "No countryOfOrgin found",
              hsnCode: productVariant?.hsnCode || "No hsnCode found",
              intheBox: productVariant?.intheBox || "No intheBox found",
              manufactureDetails:
                productVariant?.manufactureDetails ||
                "No manufactureDetails found",
              minimumOrderQty:
                productVariant?.minimumOrderQty || "No minimumOrderQty found",
              mrp: productVariant?.mrp || "No mrp found",
              packerDetails:
                productVariant?.packerDetails || "No packerDetails found",
              procurementSLA:
                productVariant?.procurementSLA || "No procurementSLA found",
              procurementType:
                productVariant?.procurementType || "No procurementType found",
              productDiscription:
                productVariant?.productDiscription ||
                "No productDiscription found",
              productTitle:
                productVariant?.productTitle || "No productTitle found",
              sellingPrice:
                productVariant?.sellingPrice || "No sellingPrice found",
              shippingProvider:
                productVariant?.shippingProvider || "No shippingProvider found",
              taxCode: productVariant?.taxCode || "No taxCode found",
              warantySummary:
                productVariant?.warantySummary || "No warantySummary found",
              warrantyPeriod:
                productVariant?.warrantyPeriod || "No warrantyPeriod found",
              colorName: productVariant?.colorName || "No colorName found",
            };
          }),
        );

        const productVariantIds = variantdata.map(
          (productVariant: { _id: any }) => productVariant._id,
        ); // Use response directly
        if (productVariantIds.length > 0) {
          fetchProducstock(productVariantIds);
        }
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
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
                stock.productvariantId === product.productVariantId,
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

    fetchProduct();
    setSetApproved(false);
  }, [approved]);

  // handle Reject
  const handleReject = async (id: string) => {
    console.log(`Approved seller with ID: ${id}`);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/approved/${id}`,
        { qcStatus: -1 },
      );
      console.log("Seller Approved:", response.data);
      setSetApproved(true);
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
    }
    // Here you would typically update state or call an API
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Approved Products</h1>
        <p>Review and approve products submitted by sellers</p>
      </header>

      <main>
        {fetchedData.map((product) => (
          <div className={styles.product_card} key={product._id}>
            <div className={styles.product_header}>
              <div>
                <h2>{product.productTitle}</h2>
                <span className={styles.sku_id}>Sku_ID: {product.skuId}</span>
              </div>
              <span className={styles.status}>Approved</span>
            </div>

            <div className={styles.product_info}>
              <div className={styles.column}>
                <div className={styles.seller_info}>
                  <h4>Seller Information</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Seller Name:</span>
                    <span className={styles.value}>{product.sellerName}</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Seller ID:</span>
                    <span className={styles.value}>{product.sellerId}</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Submission Date:</span>
                    <span className={styles.value}>{product.createdAt}</span>
                  </div>
                </div>

                <div className={styles.pricing_stock}>
                  <h4>Pricing & Stock</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>MRP:</span>
                    <span className={styles.value}>₹{product.mrp}</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Selling Price:</span>
                    <span className={styles.value}>
                      ₹{product.sellingPrice}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Stock:</span>
                    <span className={styles.value}>
                      {product.stockqty} units
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Min. Order Qty:</span>
                    <span className={styles.value}>
                      {product.minimumOrderQty}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.shipping}>
                  <h4>Shipping Details</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Shipping Provider:</span>
                    <span className={styles.value}>
                      {product.shippingProvider}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Local Delivery:</span>
                    <span className={styles.value}>
                      ₹{product.localDeliveryCharge}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Zonal Delivery:</span>
                    <span className={styles.value}>
                      ₹{product.zonalDeliveryCharge}
                    </span>
                  </div>
                </div>
                <div className={styles.taxes_procurement}>
                  <h4>Tax & Procurement</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>HSN Code:</span>
                    <span className={styles.value}>{product.hsnCode}</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Tax Code:</span>
                    <span className={styles.value}>{product.taxCode}</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Procurement:</span>
                    <span className={styles.value}>
                      {product.procurementType}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Fullfilement By:</span>
                    <span className={styles.value}>{product.fulfilmentBy}</span>
                  </div>
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.dimensions}>
                  <h4>Dimensions & Weight</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Length:</span>
                    <span className={styles.value}>{product.Length} cm</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Breadth:</span>
                    <span className={styles.value}>{product.breadth} cm</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Height:</span>
                    <span className={styles.value}>{product.height} cm</span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Weight:</span>
                    <span className={styles.value}>{product.weight} kg</span>
                  </div>
                </div>

                <div className={styles.origin_details}>
                  <h4>Origin & Manufacturing</h4>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Country of Origin:</span>
                    <span className={styles.value}>
                      {product.countryOfOrgin}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Manufacturer:</span>
                    <span className={styles.value}>
                      {product.manufactureDetails}
                    </span>
                  </div>
                  <div className={styles.info_row}>
                    <span className={styles.label}>Packer:</span>
                    <span className={styles.value}>
                      {product.packerDetails}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.column_actions}>
                <div className={styles.product_description}>
                  <h4>Product Description</h4>
                  <p className={styles.description_text}>
                    {product.productDiscription}
                  </p>

                  <h4>What's in the Box</h4>
                  <p className={styles.description_text}>{product.intheBox}</p>
                </div>

                <div className={styles.product_images}>
                  <h4>Product Images</h4>
                </div>

                <div className={styles.action_buttons}>
                  <button
                    className={`${styles.btn} ${styles.reject_btn}`}
                    onClick={() => handleReject(product._id)}
                  >
                    Reject Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ApprovedProduct;
