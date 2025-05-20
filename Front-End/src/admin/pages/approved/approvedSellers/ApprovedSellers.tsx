import React, { useEffect, useState } from "react";
import styles from "./ApprovedSellers.module.css";
import axios from "axios";

interface fetchedDataProps {
  _id: string;
  sellerName: string;
  sellerEmail: string;
  sellerMobileNumber: string;
  sellerDisplayName: string;
  sellerGST: string;
  bankAccountNo: string;
  ifscCode: string;
  storeDiscription: string;
  createdAt: string;
  address?: string;
  pincode?: string;
}

const ApprovedSellers: React.FC = () => {
  const [fetchedData, setfetchedData] = useState<fetchedDataProps[]>([]);
  const [approved, setSetApproved] = useState<boolean>(false);

  // useeffect for fetch the seller details

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/seller/ApprovedSeller",
        );
        console.log("Fetched Sellers:", response.data.data);

        setfetchedData(response.data.data); // Update state

        const sellerIds = response.data.data.map(
          (seller: { _id: any }) => seller._id,
        ); // Use response directly
        if (sellerIds.length > 0) {
          fetchAddressOfSellers(sellerIds);
        }
      } catch (error: any) {
        console.error("Error fetching sellers:", error);
      }
    };

    // fetch the address of the seller
    const fetchAddressOfSellers = async (sellerIds: string[]) => {
      console.log("Fetching addresses for seller IDs:", sellerIds);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/address/getBySellerIds",
          { sellerIds },
        );
        console.log("Fetched Addresses:", response.data);
        const addressData = response.data.data;

        setfetchedData((prevSellers) =>
          prevSellers.map((seller) => {
            const sellerAddress = addressData.find(
              (addr: { sellerId: string }) => addr.sellerId === seller._id,
            );
            return {
              ...seller,
              address: sellerAddress?.address || "No address found",
              pincode: sellerAddress?.pincode || "No PinCode",
            };
          }),
        );
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchSeller();
    setSetApproved(false);
  }, [approved]);

  // handle Reject
  const handleReject = async (id: string) => {
    console.log(`Approved seller with ID: ${id}`);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/seller/approved/${id}`,
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
        <h1>Approved Sellers</h1>
        <p>Review and approve seller registration requests</p>
      </header>

      <main>
        {fetchedData.map((seller) => (
          <div className={styles.seller_card} key={seller._id}>
            <div className={styles.seller_header}>
              <h2>Seller Details</h2>
              <span className={styles.status}>Approved</span>
            </div>

            <div className={styles.seller_content}>
              {/* First column */}
              <div className={styles.column}>
                <div className={styles.info_row}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{seller.sellerName}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Business Name:</span>
                  <span className={styles.value}>
                    {seller.sellerDisplayName}
                  </span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{seller.sellerEmail}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Phone:</span>
                  <span className={styles.value}>
                    (+91) {seller.sellerMobileNumber}
                  </span>
                </div>
              </div>

              {/* Second column */}
              <div className={styles.column}>
                <div className={styles.info_row}>
                  <span className={styles.label}>Address:</span>
                  <span className={styles.value}>{seller.address}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Pincode</span>
                  <span className={styles.value}>{seller.pincode}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Tax ID:</span>
                  <span className={styles.value}>{seller.sellerGST}</span>
                </div>
                <div className={styles.info_row}>
                  <span className={styles.label}>Registration:</span>
                  <span className={styles.value}>
                    {new Date(seller.createdAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Third column - Documents and Buttons */}
              <div className={styles.column_actions}>
                {/* <div className={styles.documents_container}>
                  <h3>Submitted Documents</h3>
                  <div className={styles.document_links}>
                    {seller.documents.map((doc, index) => (
                      <a 
                        href={doc.url} 
                        className={styles.document_link} 
                        key={index} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
                 */}
                <div className={styles.action_buttons}>
                  {/* <button
                    className={`${styles.btn} ${styles.approve_btn}`}
                    onClick={() => handleApprove(seller._id)}
                  >
                    Approve
                  </button> */}
                  <button
                    className={`${styles.btn} ${styles.reject_btn}`}
                    onClick={() => handleReject(seller._id)}
                  >
                    Reject
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

export default ApprovedSellers;
