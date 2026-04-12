import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import API from "../../api/axios";
import styles from "./home.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const formatCount = (count, singular, plural = `${singular}s`) => {
  const value = Number(count) || 0;
  return `${value} ${value === 1 ? singular : plural}`;
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsRes, userRes] = await Promise.all([
          API.get("/api/posts"),
          API.get("/api/users/me"),
        ]);

        const postsData = postsRes.data || [];
        setPosts(postsData);
        setCurrentUser(userRes.data || null);

        const commentsEntries = await Promise.all(
          postsData.map(async (post) => {
            try {
              const commentsRes = await API.get(`/api/comments/${post._id}`);
              return [post._id, commentsRes.data?.length || 0];
            } catch (error) {
              console.log("Comments count error:", error);
              return [post._id, 0];
            }
          })
        );

        setCommentCounts(Object.fromEntries(commentsEntries));
      } catch (err) {
        console.log("Home page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.pageLabel}>Main</p>
        <div className={styles.emptyState}>
          <h2>Loading feed...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <p className={styles.pageLabel}>Main</p>

      {posts.length > 0 ? (
        <>
          <div className={styles.grid}>
            {posts.map((post) => (
              <article key={post._id} className={styles.postCard}>
                <div className={styles.header}>
                  <div className={styles.author}>
                    <img
                      src={getImageUrl(post.author?.avatar)}
                      alt={post.author?.username || "user"}
                      className={styles.avatar}
                    />

                    <div className={styles.authorInfo}>
                      <p className={styles.username}>{post.author?.username || "unknown"}</p>
                      <span className={styles.time}>2 week</span>
                    </div>
                  </div>

                  <button type="button" className={styles.moreButton}>
                    <MoreHorizIcon />
                  </button>
                </div>

                <img
                  src={getImageUrl(post.image)}
                  alt={post.caption || "post"}
                  className={styles.postImage}
                />

                <div className={styles.body}>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => handleToggleLike(post._id)}
                    >
                      <FavoriteBorderIcon />
                    </button>
                    <button type="button" className={styles.actionButton}>
                      <ChatBubbleOutlineIcon />
                    </button>
                  </div>

                  <p className={styles.likes}>
                    {formatCount(post.likes?.length, "like")}
                  </p>
                  <p className={styles.caption}>
                    <strong>{post.author?.username || "unknown"}</strong>{" "}
                    {post.caption || "heryyy"}
                  </p>
                  <p className={styles.comments}>
                    View all comments ({commentCounts[post._id] || 0})
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.endBlock}>
            <div className={styles.endIcon}>✓</div>
            <p className={styles.endTitle}>You&apos;ve seen all the updates</p>
            <p className={styles.endText}>You have viewed all new publications</p>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <h2>Your feed is empty</h2>
          <p>Create the first post to make this page look like the Figma screen.</p>
        </div>
      )}
    </section>
  );
};

export default Home;
