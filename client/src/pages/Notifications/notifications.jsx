import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import API from "../../api/axios";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
import homeStyles from "../Main/home.module.css";
import styles from "./notifications.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const formatCount = (count, singular, plural = `${singular}s`) => {
  const value = Number(count) || 0;
  return `${value} ${value === 1 ? singular : plural}`;
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} mo`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} y`;
};

const notificationText = (type) => {
  if (type === "like") return "liked your photo.";
  if (type === "comment") return "commented your photo.";
  if (type === "follow") return "started following.";
  return "sent an update.";
};

const Notifications = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, userRes, notificationsRes] = await Promise.all([
          API.get("/api/posts"),
          API.get("/api/users/me"),
          API.get("/api/notifications"),
        ]);

        const postsData = postsRes.data || [];
        setPosts(postsData);
        setCurrentUser(userRes.data || null);
        setNotifications(notificationsRes.data || []);

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
        console.log("Notifications page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const refreshAll = () => {
      fetchData();
    };

    window.addEventListener("notifications-changed", refreshAll);
    window.addEventListener("posts-changed", refreshAll);

    const intervalId = window.setInterval(fetchData, 8000);

    return () => {
      window.removeEventListener("notifications-changed", refreshAll);
      window.removeEventListener("posts-changed", refreshAll);
      window.clearInterval(intervalId);
    };
  }, []);

  const handleToggleLike = async (postId) => {
    try {
      const res = await API.post(`/api/likes/${postId}`);
      const nextLikesCount = res.data?.likesCount ?? 0;
      window.dispatchEvent(new Event("notifications-changed"));

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

  const selectedPost =
    posts.find((post) => post._id === selectedPostId) || null;

  return (
    <section className={styles.wrapper}>
      <p className={styles.pageLabel}>Main - notification</p>

      <div className={styles.stage}>
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.title}>Notifications</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => navigate("/home")}
              aria-label="Close notifications"
            >
              <CloseIcon />
            </button>
          </div>
          <p className={styles.sectionLabel}>New</p>

          {loading ? (
            <p className={styles.emptyText}>Loading...</p>
          ) : notifications.length > 0 ? (
            <div className={styles.list}>
              {notifications.map((item) => (
                <div key={item._id} className={styles.item}>
                  <img
                    src={getImageUrl(item.sender?.avatar)}
                    alt={item.sender?.username || "user"}
                    className={styles.avatar}
                  />

                  <div className={styles.textBlock}>
                    <p className={styles.itemText}>
                      <strong>{item.sender?.username || "user"}</strong>{" "}
                      {notificationText(item.type)}
                    </p>
                    <span className={styles.time}>
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {item.post?.image ? (
                    <img
                      src={getImageUrl(item.post.image)}
                      alt="post preview"
                      className={styles.preview}
                    />
                  ) : (
                    <div className={styles.previewPlaceholder} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No notifications yet.</p>
          )}
        </aside>

        <div className={styles.overlayFeed}>
          <button
            type="button"
            className={styles.overlayClose}
            onClick={() => navigate("/home")}
            aria-label="Close notifications panel"
          />

          <div className={styles.feedPreview}>
            <section
              className={homeStyles.page}
              onClick={() => navigate("/home")}
            >
              <div className={homeStyles.grid}>
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className={homeStyles.postCard}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedPostId(post._id);
                    }}
                  >
                    <div className={homeStyles.header}>
                      <div className={homeStyles.author}>
                        <img
                          src={getImageUrl(post.author?.avatar)}
                          alt={post.author?.username || "user"}
                          className={homeStyles.avatar}
                        />

                        <div className={homeStyles.authorInfo}>
                          <p className={homeStyles.username}>
                            {post.author?.username || "unknown"}
                          </p>
                          <span className={homeStyles.time}>
                            {formatRelativeTime(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={homeStyles.moreButton}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreHorizIcon />
                      </button>
                    </div>

                    <img
                      src={getImageUrl(post.image)}
                      alt={post.caption || "post"}
                      className={homeStyles.postImage}
                    />

                    <div className={homeStyles.body}>
                      <div className={homeStyles.actions}>
                        <button
                          type="button"
                          className={homeStyles.actionButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggleLike(post._id);
                          }}
                        >
                          <FavoriteBorderIcon />
                        </button>
                        <button
                          type="button"
                          className={homeStyles.actionButton}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ChatBubbleOutlineIcon />
                        </button>
                      </div>

                      <p className={homeStyles.likes}>
                        {formatCount(post.likes?.length, "like")}
                      </p>
                      <p className={homeStyles.caption}>
                        <strong>{post.author?.username || "unknown"}</strong>{" "}
                        {post.caption || "heryyy"}
                      </p>
                      <p
                        className={homeStyles.comments}
                        onClick={(event) => event.stopPropagation()}
                      >
                        View all comments ({commentCounts[post._id] || 0})
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className={homeStyles.endBlock}>
                <div className={homeStyles.endIcon}>✓</div>
                <p className={homeStyles.endTitle}>You&apos;ve seen all the updates</p>
                <p className={homeStyles.endText}>You have viewed all new publications</p>
              </div>
            </section>
          </div>

          {selectedPost && (
            <PostDetailModal
              post={selectedPost}
              currentUser={currentUser}
              onClose={() => setSelectedPostId(null)}
              onLike={handleToggleLike}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Notifications;
