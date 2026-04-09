 import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 ДОБАВИТЬ
import API from "../../api/axios";
import styles from "./create.module.css";

const Create = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 ДОБАВИТЬ

  const navigate = useNavigate(); // 🔥 ДОБАВИТЬ

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Select image");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);

      await API.post("/api/posts", formData);

      // 🔥 если modal — закрываем
      if (onClose) onClose();

      // 🔥 переход
      navigate("/profile");

    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* HEADER */}
        <div className={styles.header}>
          <span>Create new post</span>

          <button
            className={styles.shareBtn}
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>

          {/* LEFT */}
          <div className={styles.left}>
            {preview ? (
              <div className={styles.previewWrapper}>
                <img src={preview} alt="preview" />

                <div className={styles.actions}>
                  <label className={styles.changeBtn}>
                    Change
                    <input type="file" onChange={handleChange} hidden />
                  </label>

                  <button type="button" onClick={handleRemove}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className={styles.uploadBox}>
                <input type="file" onChange={handleChange} hidden />
                <span>Upload image</span>
              </label>
            )}
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
            />

            <div className={styles.counter}>
              {caption.length}/200
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Create;