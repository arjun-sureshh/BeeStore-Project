import React, { useEffect, useState } from "react";
import styles from "./Color.module.css";
import axios from "axios";

interface allcolorProps {
  color: string;
  _id: string;
}

const Color: React.FC = () => {
  const [color, setColor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [backEndError, setBackEndError] = useState<string>(""); // handle the back end error

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // State for confirmation
  const [coloradded, setColorAdded] = useState<Record<string, any>>({});
  const [allcolor, setAllcolor] = useState<allcolorProps[]>([]);
  const [clickUpdateId, setClickUpdateId] = useState<string | null>(null);

  // add district to database

  const handleSubmit = async () => {
    if (!color) {
      return setBackEndError(""), setError("Color name is required");
    }
    const data: Object = {
      color: color,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/color",
        data,
      );
      setColorAdded(response);
      setColor("");
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
  const fetchcolor = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/color");
      // console.log(response)
      setAllcolor(response.data.data);
    } catch (error) {
      console.error("Error Fetching color:", error);
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

  //  delete the color from the database

  const deleteItem = async (_id?: string) => {
    if (!_id) {
      throw new Error("color ID is required");
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/color/${_id}`,
      );
      console.log(response);

      // Remove  the deleted color for UI
      setAllcolor((prev) => prev.filter((color) => color._id !== _id));
      setConfirmDelete("");
    } catch (error) {
      console.error("Error Deleting color:", error);
    }
  };

  //  fetch the color which want to update

  const fetchUpdateData = async (_id?: string) => {
    if (!_id) {
      throw new Error("color ID is required");
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/color/${_id}`,
      );
      const colorName = response.data.data.color;
      const colorId = response.data.data._id;
      setColor(colorName);
      setClickUpdateId(colorId);
    } catch (error) {
      console.error("Error Deleting color:", error);
    }
  };

  //  update function
  const handleUpdate = async () => {
    try {
      const afterUpdate = await axios.put(
        `http://localhost:5000/api/color/${clickUpdateId}`,
        { color: color },
      );
      console.log(afterUpdate);

      setColor("");
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
    setColor("");
    setClickUpdateId("");
  };

  //  useEffect used
  useEffect(() => {
    fetchcolor();
    setError("");
    setConfirmDelete("");
    setBackEndError("");
  }, [coloradded, clickUpdateId]);

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
              <div className={styles.title}>Color</div>
              <input
                type="text"
                className={`${styles.input} ${error ? styles.errorInput : ""}`}
                value={color}
                placeholder={error ? error : "Enter Color"}
                onChange={(e) => setColor(e.target.value)}
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
        <table className={styles.displayTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>District Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allcolor.length > 0 ? (
              allcolor.map((color, index) => (
                <tr key={color._id}>
                  <td>{index + 1}</td>
                  <td>{color.color}</td>
                  <td className={styles.action}>
                    <span
                      className={styles.delete}
                      onClick={() => confirmBox(color._id)}
                    >
                      Delete
                    </span>
                    /
                    <span
                      className={styles.update}
                      onClick={() => fetchUpdateData(color._id)}
                    >
                      Update
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  No Colors available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Color;
