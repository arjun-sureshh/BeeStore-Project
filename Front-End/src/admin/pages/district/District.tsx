import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./District.module.css";

interface alldistrictProps {
  districtName: string;
  _id: string;
}

const District: React.FC = () => {
  const [district, setdistrict] = useState<string>(""); // handle the Entered value
  const [error, setError] = useState<string>(""); // Error handle
  const [backEndError, setBackEndError] = useState<string>(""); // handle the back end error
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // State for confirmation
  const [districtadded, setDistrictAdded] = useState<Record<string, any>>({}); // to confirm the valule added
  const [alldistrict, setAlldistrict] = useState<alldistrictProps[]>([]); // handle fetch data
  const [clickUpdateId, setClickUpdateId] = useState<string | null>(null); // handle the ID to update

  // add district to database
  const handleSubmit = async () => {
    if (!district) {
      return setBackEndError(""), setError("District name is required");
    }
    const data: Object = {
      districtName: district,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/district",
        data,
      );
      // console.log(response);
      setDistrictAdded(response.data);
      setdistrict("");
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
  const fetchdistrict = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/district");

      setAlldistrict(response.data.data);
    } catch (error) {
      console.error("Error Fetching district:", error);
    }
  };
  // confirm Box for delete

  const confirmBox = (_id: string) => {
    setConfirmDelete(_id);
  };
  // cancle the delete
  const cancelDelete = () => {
    setConfirmDelete("");
  };

  // delete data
  const deleteDistrict = async (_id: string | null) => {
    if (!_id) {
      throw new Error("District ID is required");
    }
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/district/${_id}`,
      );
      console.log(response);

      setAlldistrict((prev) => prev.filter((district) => district._id !== _id));
      setConfirmDelete("");
      setError("");
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  // set the selected district in to district usesate

  const updateDIstrict = async (_id?: string) => {
    if (!_id) {
      throw new Error("District ID is required");
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/district/${_id}`,
      );

      const districtName = response.data.data.districtName;
      const districtId = response.data.data._id;
      setdistrict(districtName);
      setClickUpdateId(districtId);
    } catch (error) {
      console.error("Error Updating district:", error);
    }
  };

  // handle update ,change the district
  const handleUpdate = async () => {
    try {
      const afterUpdate = await axios.put(
        `http://localhost:5000/api/district/${clickUpdateId}`,
        { districtName: district },
      );
      console.log(afterUpdate);

      setdistrict("");
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
    setdistrict("");
    setClickUpdateId("");
  };
  //  UseEffect used here
  useEffect(() => {
    fetchdistrict();
    setError("");
    setConfirmDelete("");
    setBackEndError("");
  }, [districtadded, clickUpdateId]);

  return (
    <div className={styles.body}>
      <div className={styles.Box}>
        {confirmDelete ? (
          <div className={styles.wrapperBox}>
            <p>Are you sure you want to delete this district?</p>
            <div className={styles.btnRow}>
              <button
                className={styles.btnConfirm}
                onClick={() => deleteDistrict(confirmDelete)}
              >
                Confirm
              </button>
              <button className={styles.btnCancel} onClick={cancelDelete}>
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
              <div className={styles.title}>District</div>
              <input
                type="text"
                className={error ? styles.errorInput : styles.input}
                value={district}
                placeholder={error ? error : "Enter District Name"}
                onChange={(e) => setdistrict(e.target.value)}
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

      {/* District Table */}

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
            {alldistrict && alldistrict.length > 0 ? (
              alldistrict.map((district, index) => (
                <tr key={district._id}>
                  <td>{index + 1}</td>
                  <td>{district.districtName}</td>
                  <td className={styles.action}>
                    <span
                      className={styles.delete}
                      onClick={() => confirmBox(district._id)}
                    >
                      Delete
                    </span>
                    /
                    <span
                      className={styles.update}
                      onClick={() => updateDIstrict(district._id)}
                    >
                      Update
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  No districts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Box */}
    </div>
  );
};

export default District;
