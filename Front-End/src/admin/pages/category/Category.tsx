import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import axios from "axios";

interface alldataProps {
  categoryName: string;
  mainCategory: string;
  _id: string;
}

const Category: React.FC = () => {
  const [inputData, setInputData] = useState<string>(""); // handle the input data
  const [selectData, setSelectData] = useState<string>(""); // handle ID of selected  category
  const [error, setError] = useState<string>(""); // handle when we submit with out data
  const [backEndError, setBackEndError] = useState<string>(""); // handle the back end error
  const [dataAdded, setDataAdded] = useState<Record<string, any>>({}); //handle addededData
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // State for confirmation
  const [alldata, setAlldata] = useState<alldataProps[]>([]); // handle all fetch data
  const [clickUpdateId, setClickUpdateId] = useState<string | null>(null); // handle the Id of Data which what to update

  // handle the submit button
  const handleSubmit = async () => {
    if (!inputData) {
      return setBackEndError(""), setError("Policy method is required");
    }
    const data = {
      categoryName: inputData,
      mainCategory: selectData,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/category",
        data,
      );
      setDataAdded(response.data); // Save response data
      setInputData(""); // Clear input field
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
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      // console.log(response.data)
      setAlldata(response.data);
      // console.log(alldata);
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
        `http://localhost:5000/api/category/${_id}`,
      );
      console.log(response);

      // Remove  the deleted items for UI
      setAlldata((prev) => prev.filter((data) => data._id !== _id));
      setConfirmDelete("");
      setError("");
    } catch (error) {
      console.error("Error Deleting Policy details:", error);
    }
  };

  //  fetch the item  which want to update

  const fetchUpdateData = async (_id?: string) => {
    if (!_id) {
      throw new Error(" ID is required");
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/category/${_id}`,
      );
      const itemName = response.data.data.categoryName;
      const mainCategoryName = response.data.data.mainCategory;
      const itemId = response.data.data._id;
      setInputData(itemName);
      setClickUpdateId(itemId);
      setSelectData(mainCategoryName);
    } catch (error) {
      console.error("Error Deleting Policy Detials:", error);
    }
  };

  //  update function
  const handleUpdate = async () => {
    const data = {
      categoryName: inputData,
      mainCategory: selectData,
    };

    try {
      const afterUpdate = await axios.put(
        `http://localhost:5000/api/category/${clickUpdateId}`,
        data,
      );
      console.log(afterUpdate);

      setInputData("");
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
    setInputData("");
    setClickUpdateId("");
    setSelectData("");
  };

  useEffect(() => {
    fetchItems();
    setError("");
    setConfirmDelete("");
    setBackEndError("");
  }, [dataAdded, clickUpdateId]);

  return (
    <div className={styles.body}>
      <div className={styles.Box}>
        {confirmDelete ? (
          <div className={styles.wrapperBox}>
            <p>Are you sure you want to delete this catrgoy?</p>
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
          <form
            // className={styles.wrapperBox}
            onSubmit={(e) => {
              e.preventDefault();
              clickUpdateId ? handleUpdate() : handleSubmit();
            }}
          >
            <div className={styles.wrapperBox}>
              <div className={styles.title}>Category</div>
              <select
                className={styles.selectBox}
                name="mainCategory"
                value={selectData} // Controlled component
                onChange={(e) => setSelectData(e.target.value)} // Update state on change
              >
                <option value="">Select your Main Category</option>
                {alldata?.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={`${styles.input} ${error ? styles.errorInput : ""}`}
                value={inputData}
                placeholder={error ? error : "Enter Catrgory "}
                onChange={(e) => setInputData(e.target.value)}
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
            </div>
          </form>
        )}
      </div>
      {/* Display  Table */}
      <div className={styles.displayContainer}>
        <table className={styles.districtTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Main Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alldata.length > 0 ? (
              alldata.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.mainCategory}</td>
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
                  No Categories available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
