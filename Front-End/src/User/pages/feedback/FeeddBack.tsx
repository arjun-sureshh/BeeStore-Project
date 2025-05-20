import React, { useState } from "react";
import styles from "./FeedBack.module.css";
import axios from "axios";

interface FeedbackFormData {
  rating: number;
  title: string;
  description: string;
  media: File[];
}

interface FeedbackFormProps {
  cartId?: string;
  productId?: string;
  userId?: string;
  onClose: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  cartId,
  productId,
  userId,
  onClose,
}) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    title: "",
    description: "",
    media: [],
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [previews, setPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ["image/jpeg", "image/png", "video/mp4"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(
      (file) => validTypes.includes(file.type) && file.size <= maxSize,
    );

    if (validFiles.length !== files.length) {
      setError(
        "Invalid file type or size. Only JPEG, PNG, MP4 allowed (max 5MB).",
      );
    } else {
      setError("");
    }

    setFormData({ ...formData, media: validFiles });
    const newPreviews: { url: string; type: "image" | "video" }[] =
      validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image") ? "image" : "video",
      }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(cartId, productId, userId);

    if (!cartId || !productId || !userId) {
      setError("Missing required information. Please try again.");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("rating", formData.rating.toString());
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("cartId", cartId);
    formDataToSend.append("productId", productId);
    formDataToSend.append("userId", userId);
    formData.media.forEach((file) => {
      formDataToSend.append("media", file); // Changed from `media${index}` to `media`
    });

    // Debug: Log FormData contents
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/feedback",
        formDataToSend,
        {
          headers: {
            // Do not set Content-Type; browser sets it to multipart/form-data
          },
        },
      );
      setSuccess("Feedback submitted successfully!");
      setFormData({ rating: 0, title: "", description: "", media: [] });
      setPreviews([]);
      setError("");
      setTimeout(onClose, 2000); // Close after 2 seconds
      console.log(response);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting feedback.",
      );
      console.error(err);
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackModal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.feedbackTitle}>Submit Product Feedback</h2>
        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <div className={styles.formGroup}>
            <label className={styles.label}>Rating</label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${formData.rating >= star ? styles.filled : ""}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Feedback title"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Your feedback"
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="media">
              Upload Images/Videos (Optional)
            </label>
            <input
              type="file"
              id="media"
              multiple
              accept="image/jpeg,image/png,video/mp4"
              onChange={handleMediaChange}
              className={styles.fileInput}
            />
            {previews.length > 0 && (
              <div className={styles.previewGrid}>
                {previews.map((preview, index) =>
                  preview.type === "image" ? (
                    <img
                      key={index}
                      src={preview.url}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  ) : (
                    <video
                      key={index}
                      src={preview.url}
                      controls
                      className={styles.previewVideo}
                    />
                  ),
                )}
              </div>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Submit Feedback
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
