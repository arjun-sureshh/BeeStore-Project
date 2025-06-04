import React, { useState } from "react";
import styles from "./AddPhoto.module.css";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import {
  toggleAddImage,
  toggleRemoveImage,
} from "../../../../../../redux/toogleSlice";

interface AddPhotoProps {
  displyaimageblockFn: () => void;
  setSave: () => void;
  saved?: boolean;
}

const AddPhoto: React.FC<AddPhotoProps> = ({
  displyaimageblockFn,
  setSave,
  saved,
}) => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.toggle.images);

  const [upload, setUpload] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUpload(event.target.files[0]);
      setMessage(null);
    }
  };

  // Function to upload image
  const uploadHandle = () => {
    if (!upload) {
      setMessage("Please select a file before submitting.");
      return;
    }
    console.log(upload.size,"this ios yhe file");
    
    if (typeof upload.size !== "number" || upload.size <= 0) {
      console.error("Invalid file size:", upload);
      setMessage("Selected file has invalid size. Please select a valid file.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(upload); // Convert File to Base64
    reader.onloadend = () => {
      if (reader.result) {
        dispatch(toggleAddImage(upload)); // Dispatch File object
        setMessage("File added successfully!");
        setUpload(null);
        setTimeout(() => {
          setMessage("");
        }, 1000);
      }
    };
  };

  // handle save btn
  const handleSave = () => {
    if (images.length === 0) {
      setMessage("You Should Add Atleast one Product Image to Save!");
      return;
    }
    // If all required fields are filled, proceed
    setSave();
    displyaimageblockFn();
  };

  return (
    <div className={styles.body}>
      <div className={styles.titleSection}>
        <div className={styles.flex}>
          <div className={`${styles.icon} ${saved ? styles.iconSaved : ""}`}>
            <IoCheckmarkCircle />
          </div>
          <div className={styles.title}>Product Photos ({images.length})</div>
        </div>
        <div className={styles.flex}>
          <div className={styles.cancel} onClick={displyaimageblockFn}>
            Cancel
          </div>
          <div className={styles.savebtn} onClick={handleSave}>
            Save
          </div>
        </div>
      </div>

      {/* Image Preview Section */}
      <div className={styles.imagecards}>
        {images.length === 0 && (
          <div className={styles.emptyImgcard}>
            <BsFillImageFill />
          </div>
        )}

        {images.map((img, index) => (
          <div key={index} className={styles.imgcard}>
            {typeof img === "string" ? (
              <img
                src={img}
                alt={`Product ${index}`}
                className={styles.preview}
              />
            ) : img instanceof File ? (
              <img
                src={URL.createObjectURL(img)}
                alt={`Product ${index}`}
                className={styles.preview}
              />
            ) : null}
            <button
              className={styles.removeBtn}
              onClick={() => dispatch(toggleRemoveImage(index))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Image Upload Section */}
      <div className={styles.mainimgSec}>
        <div className={styles.mainimg}>
          {upload ? (
            <img
              src={URL.createObjectURL(upload)}
              alt="Preview"
              className={styles.preview}
            />
          ) : (
            <BsFillImageFill />
          )}
        </div>

        {/* Upload Button with Hidden File Input */}
        <label className={styles.uploadimagebtn}>
          <FaUpload /> Upload Photo
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
      </div>

      {message && <p className={styles.uploadMessage}>{message}</p>}

      <button className={styles.uploadBtn} onClick={uploadHandle}>
        Submit
      </button>
      {/* instruction tips */}
      <div className={styles.tipContainer}>
        <div className={styles.head}>
          <span className={styles.i}>i</span> Follow Image Guidelines to reduce
          Quality Check failures
        </div>
        <div className={styles.tipbody}>
          <div className={styles.subTitle}>Image Resolution</div>
          <div className={styles.subdef}>
            Use clear color images with a minimum resolution of 250x100 px.
          </div>
          <div className={styles.subTitle}>Image Guidelines</div>
          <div className={styles.subdef}>
            Upload authentic product photos taken in bright lighting.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhoto;