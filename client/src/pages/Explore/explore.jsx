import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./explore.module.css";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await API.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const getImgSrc = (image) =>
    image?.startsWith("http") ? image : `http://127.0.0.1:3333${image}`;

  return (
    <div className={styles.container}>
      {/* GRID */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`} />
            ))
          : posts.map((post, i) => (
              <div
                key={post._id}
                className={`${styles.card} ${i % 5 === 1 ? styles.tall : ""}`}
                onClick={() => setSelectedPost(post)}
              >
                <img src={getImgSrc(post.image)} alt={post.caption || "post"} />
                <div className={styles.cardOverlay}>
                  <span className={styles.likesCount}>
                    ♥ {post.likes?.length ?? 0}
                  </span>
                </div>
              </div>
            ))}
      </div>

      {/* MODAL */}
      {selectedPost && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedPost(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>
            <img
              src={getImgSrc(selectedPost.image)}
              alt={selectedPost.caption}
              className={styles.modalImg}
            />
            <div className={styles.modalInfo}>
              <div className={styles.modalAuthor}>
                <div className={styles.modalAvatar}>
                  {selectedPost.author?.username?.[0]?.toUpperCase()}
                </div>
                <span className={styles.modalUsername}>
                  {selectedPost.author?.username}
                </span>
              </div>
              {selectedPost.caption && (
                <p className={styles.modalCaption}>{selectedPost.caption}</p>
              )}
              <div className={styles.modalLikes}>
                <span>♥</span>
                <span>{selectedPost.likes?.length ?? 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;