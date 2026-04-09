import { useState } from "react";
import API from "../../api/axios";
import styles from "./create.module.css";

const Create = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

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

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await API.post("/post", formData);
      onClose();
    } catch (err) {
      console.log(err);
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
            disabled={!file}
          >
            Share
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
                  {/* CHANGE */}
                  <label className={styles.changeBtn}>
                    Change
                    <input
                      type="file"
                      onChange={handleChange}
                      hidden
                    />
                  </label>

                  {/* REMOVE */}
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