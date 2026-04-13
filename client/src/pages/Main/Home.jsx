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

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [emojiOpen, setEmojiOpen] = useState({});
  const [loading, setLoading] = useState(true);

  const emojiList = ["😀", "😂", "😍", "🔥", "👏", "😭"];

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

    const refreshPosts = () => {
      fetchPosts();
    };

    window.addEventListener("posts-changed", refreshPosts);

    const intervalId = window.setInterval(fetchPosts, 8000);

    return () => {
      window.removeEventListener("posts-changed", refreshPosts);
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

  const handleCommentChange = (postId, value) => {
    setCommentText((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const handleAddEmoji = (postId, emoji) => {
    setCommentText((current) => ({
      ...current,
      [postId]: `${current[postId] || ""}${emoji}`,
    }));
  };

  const handleToggleComments = async (postId) => {
    const isOpen = openComments[postId];

    if (isOpen) {
      setOpenComments((current) => ({
        ...current,
        [postId]: false,
      }));
      return;
    }

    try {
      const res = await API.get(`/api/comments/${postId}`);

      setCommentsByPost((current) => ({
        ...current,
        [postId]: res.data || [],
      }));

      setOpenComments((current) => ({
        ...current,
        [postId]: true,
      }));
    } catch (error) {
      console.log("Load comments error:", error);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      setCommentLoading((current) => ({
        ...current,
        [postId]: true,
      }));

      const res = await API.post(`/api/comments/${postId}`, { text });

      setCommentCounts((current) => ({
        ...current,
        [postId]: (current[postId] || 0) + 1,
      }));

      setCommentsByPost((current) => ({
        ...current,
        [postId]: [res.data, ...(current[postId] || [])],
      }));

      setOpenComments((current) => ({
        ...current,
        [postId]: true,
      }));

      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));

      window.dispatchEvent(new Event("notifications-changed"));
    } catch (error) {
      console.log("Comment error:", error);
    } finally {
      setCommentLoading((current) => ({
        ...current,
        [postId]: false,
      }));
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
                      <span className={styles.time}>
                        {formatRelativeTime(post.createdAt)}
                      </span>
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
                  <button
                    type="button"
                    className={styles.commentsButton}
                    onClick={() => handleToggleComments(post._id)}
                  >
                    View all comments ({commentCounts[post._id] || 0})
                  </button>

                  {openComments[post._id] && (
                    <div className={styles.commentsList}>
                      {(commentsByPost[post._id] || []).length > 0 ? (
                        commentsByPost[post._id].map((comment) => (
                          <p key={comment._id} className={styles.commentItem}>
                            <strong>
                              {comment.user?.username || "user"}
                            </strong>{" "}
                            {comment.text}
                          </p>
                        ))
                      ) : (
                        <p className={styles.noComments}>No comments yet.</p>
                      )}
                    </div>
                  )}

                  <div className={styles.commentForm}>
                    <div className={styles.emojiWrapper}>
                      <button
                        type="button"
                        className={styles.emojiButton}
                        onClick={() =>
                          setEmojiOpen((current) => ({
                            ...current,
                            [post._id]: !current[post._id],
                          }))
                        }
                      >
                        😊
                      </button>

                      {emojiOpen[post._id] && (
                        <div className={styles.emojiPanel}>
                          {emojiList.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className={styles.emojiOption}
                              onClick={() => handleAddEmoji(post._id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(event) =>
                        handleCommentChange(post._id, event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAddComment(post._id);
                        }
                      }}
                      className={styles.commentInput}
                    />

                    <button
                      type="button"
                      className={styles.commentButton}
                      onClick={() => handleAddComment(post._id)}
                      disabled={
                        commentLoading[post._id] ||
                        !commentText[post._id]?.trim()
                      }
                    >
                      {commentLoading[post._id] ? "..." : "Post"}
                    </button>
                  </div>
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
