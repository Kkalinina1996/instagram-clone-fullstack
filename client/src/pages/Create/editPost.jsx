import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import styles from "./editPost.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/api/posts/${id}`);
        setPost(res.data || null);
      } catch (error) {
        console.log("Edit post load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      setActionLoading("delete");
      await API.delete(`/api/posts/${id}`);
      window.dispatchEvent(new Event("posts-changed"));
      navigate("/profile");
    } catch (error) {
      console.log("Delete post error:", error);
    } finally {
      setActionLoading("");
    }
  };

  const handleCopyLink = async () => {
    try {
      setActionLoading("copy");
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.log("Copy link error:", error);
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return <div className={styles.page}>Loading post...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1>Edit post</h1>
      </div>

      <div className={styles.frame}>
        <div className={styles.previewArea}>
          <img
            src={getImageUrl(post?.image)}
            alt={post?.caption || "post"}
            className={styles.previewImage}
          />
        </div>

        <div className={styles.menuWrap}>
          <div className={styles.menu}>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.danger}`}
              onClick={handleDelete}
              disabled={actionLoading === "delete"}
            >
              {actionLoading === "delete" ? "Deleting..." : "Delete"}
            </button>

            <button
              type="button"
              className={styles.menuItem}
              onClick={() => navigate(`/edit-post/${id}`)}
            >
              Edit
            </button>

            <button
              type="button"
              className={styles.menuItem}
              onClick={() => navigate("/home")}
            >
              Go to post
            </button>

            <button
              type="button"
              className={styles.menuItem}
              onClick={handleCopyLink}
              disabled={actionLoading === "copy"}
            >
              {actionLoading === "copy" ? "Copying..." : "Copy link"}
            </button>

            <button
              type="button"
              className={styles.menuItem}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
