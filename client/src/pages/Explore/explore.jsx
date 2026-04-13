import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
import styles from "./explore.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const getTileType = (index) => {
  const pattern = [
    "square",
    "square",
    "tall",
    "square",
    "square",
    "tall",
    "big",
    "square",
    "square",
    "square",
    "wide",
    "square",
  ];

  return pattern[index % pattern.length];
};

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, userRes] = await Promise.all([
          API.get("/api/posts"),
          API.get("/api/users/me"),
        ]);

        setPosts(postsRes.data || []);
        setCurrentUser(userRes.data || null);
      } catch (error) {
        console.log("Explore error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.addEventListener("posts-changed", fetchData);

    return () => {
      window.removeEventListener("posts-changed", fetchData);
    };
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post._id === selectedPostId) || null,
    [posts, selectedPostId]
  );

  const handleToggleLike = async (postId) => {
    try {
      const res = await API.post(`/api/likes/${postId}`);
      const nextLikesCount = res.data?.likesCount ?? 0;

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id !== postId) return post;

          const alreadyLiked = Array.isArray(post.likes)
            ? post.likes.some((like) => {
                if (typeof like === "string") return like === currentUser?._id;
                return like?._id === currentUser?._id || like?.toString?.() === currentUser?._id;
              })
            : false;

          const nextLikes = alreadyLiked
            ? (post.likes || []).filter((like) => {
                if (typeof like === "string") return like !== currentUser?._id;
                return like?._id !== currentUser?._id && like?.toString?.() !== currentUser?._id;
              })
            : [...(post.likes || []), currentUser?._id || "me"];

          if (nextLikes.length !== nextLikesCount) {
            return {
              ...post,
              likes: Array.from({ length: nextLikesCount }, (_, index) =>
                index < nextLikes.length ? nextLikes[index] : `like-${index}`
              ),
            };
          }

          return { ...post, likes: nextLikes };
        })
      );

      window.dispatchEvent(new Event("notifications-changed"));
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  return (
    <section className={styles.wrapper}>
      <p className={styles.pageLabel}>Interest</p>

      <div className={styles.stage}>
        <div className={styles.canvas}>
          {loading ? (
            <p className={styles.loadingText}>Loading posts...</p>
          ) : (
            <div className={styles.mosaic}>
              {posts.map((post, index) => (
                <article
                  key={post._id}
                  className={`${styles.tile} ${styles[getTileType(index)]}`}
                  onClick={() => setSelectedPostId(post._id)}
                >
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.caption || "post"}
                    className={styles.image}
                  />
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPostId(null)}
          onLike={handleToggleLike}
        />
      )}
    </section>
  );
};

export default Explore;
