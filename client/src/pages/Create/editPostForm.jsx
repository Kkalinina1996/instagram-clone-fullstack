import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import styles from "./editPostForm.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const EditPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/api/posts/${id}`);
        setPost(res.data);
        setCaption(res.data?.caption || "");
        setPreview(getImageUrl(res.data?.image));
      } catch (error) {
        console.log("Edit post error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("caption", caption);

      if (file) {
        formData.append("image", file);
      }

      await API.put(`/api/posts/${id}`, formData);
      window.dispatchEvent(new Event("posts-changed"));
      navigate("/profile");
    } catch (error) {
      console.log("Save post error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.page}>Loading post...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Edit post</h2>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.left}>
            <label className={styles.uploadBox}>
              <input type="file" hidden onChange={handleFileChange} />
              <span>Change image</span>
            </label>

            <div className={styles.preview}>
              <img src={preview} alt="preview" />
            </div>
          </div>

          <div className={styles.right}>
            <label className={styles.label}>Caption</label>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className={styles.textarea}
              maxLength={200}
            />

            <p className={styles.counter}>{caption.length}/200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostForm;
