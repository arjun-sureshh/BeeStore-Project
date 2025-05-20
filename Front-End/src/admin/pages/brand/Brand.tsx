import React, { useEffect, useState } from "react";
import styles from "./Brand.module.css";
import axios from "axios";

interface allbrandProps {
  brandName: string;
  _id: string;
}

const Brand: React.FC = () => {
  const [brand, setBrand] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [backEndError, setBackEndError] = useState<string>(""); // handle the back end error

  const [brandadded, setbrandAdded] = useState<Record<string, any>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // State for confirmation
  const [allbrand, setAllbrand] = useState<allbrandProps[]>([]);
  const [clickUpdateId, setClickUpdateId] = useState<string | null>(null);

  // handle the submit button
  const handleSubmit = async () => {
    if (!brand) {
      return setError("Brand Name is required");
    }
    const data: Object = {
      brandName: brand,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/brand",
        data,
      );
      setbrandAdded(response.data);
      setBrand("");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // console.error("Error:", error.response.data.message);
        setBackEndError(error.response.data.message); // Update error state
      } else {
        // console.error("Unexpected error:", error);
        setBackEndError("Something went wrong. Please try again.");
      }
    }
  };

  // fetch data from the back end
  const fetchbrand = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/brand");
      // console.log(response)
      setAllbrand(response.data.brandDetails);
    } catch (error) {
      console.error("Error Fetching Data:", error);
    }
  };

  // confirm Box for delete

  const confirmBox = (_id: string) => {
    setConfirmDelete(_id);
  };
  // cancle the delete
  const cancelRequest = () => {
    setConfirmDelete("");
  };

  // delete the Brand

  const deleteItem = async (_id: string) => {
    if (!_id) {
      throw new Error(" ID is required");
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/brand/${_id}`,
      );
      console.log(response);

      // Remove  the deleted color for UI
      setAllbrand((prev) => prev.filter((data) => data._id !== _id));
      setConfirmDelete("");
      setError("");
    } catch (error) {
      console.error("Error Deleting :", error);
    }
  };

  //  fetch the color which want to update

  const fetchUpdateData = async (_id?: string) => {
    if (!_id) {
      throw new Error(" ID is required");
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/brand/${_id}`,
      );
      const colorName = response.data.data.brandName;
      const colorId = response.data.data._id;
      setBrand(colorName);
      setClickUpdateId(colorId);
    } catch (error) {
      console.error("Error Deleting :", error);
    }
  };

  //  update function
  const handleUpdate = async () => {
    try {
      const afterUpdate = await axios.put(
        `http://localhost:5000/api/brand/${clickUpdateId}`,
        { brandName: brand },
      );
      console.log(afterUpdate);

      setBrand("");
      setClickUpdateId("");
      setBackEndError("");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // console.error("Error:", error.response.data.message);
        setBackEndError(error.response.data.message); // Update error state
      } else {
        // console.error("Unexpected error:", error);
        setBackEndError("Something went wrong. Please try again.");
      }
    }
  };
  // reset Update

  const resetUpdate = () => {
    setBrand("");
    setClickUpdateId("");
  };

  // UseEffect
  useEffect(() => {
    fetchbrand();
    setError("");
    setConfirmDelete("");
    setBackEndError("");
  }, [brandadded, clickUpdateId]);

  return (
    <div className={styles.body}>
      <div className={styles.Box}>
        {confirmDelete ? (
          <div className={styles.wrapperBox}>
            <p>Are you sure you want to delete this district?</p>
            <div className={styles.btnRow}>
              <button
                className={styles.btnConfirm}
                onClick={() => deleteItem(confirmDelete)}
              >
                Confirm
              </button>
              <button className={styles.btnCancel} onClick={cancelRequest}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <form
              className={styles.wrapperBox}
              onSubmit={(e) => {
                e.preventDefault();
                clickUpdateId ? handleUpdate() : handleSubmit();
              }}
            >
              <div className={styles.title}>Brand</div>
              <input
                type="text"
                className={`${styles.input} ${error ? styles.errorInput : ""}`}
                value={brand}
                placeholder={error ? error : "Enter Brand"}
                onChange={(e) => setBrand(e.target.value)}
              />
              <div className={styles.backEndError}>{backEndError}</div>
              {clickUpdateId ? (
                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={resetUpdate}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.button}>
                    Update
                  </button>
                </div>
              ) : (
                <button type="submit" className={styles.button}>
                  submit
                </button>
              )}
            </form>
          </>
        )}
      </div>

      {/* color Table */}
      <div className={styles.displayContainer}>
        <table className={styles.districtTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>District Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allbrand.length > 0 ? (
              allbrand.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.brandName}</td>
                  <td className={styles.action}>
                    <span
                      className={styles.delete}
                      onClick={() => confirmBox(item._id)}
                    >
                      Delete
                    </span>
                    /
                    <span
                      className={styles.update}
                      onClick={() => fetchUpdateData(item._id)}
                    >
                      Update
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  No Brands available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brand;
