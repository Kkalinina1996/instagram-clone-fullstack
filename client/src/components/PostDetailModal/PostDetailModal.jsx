import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import API from "../../api/axios";
import styles from "./PostDetailModal.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
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

const isLikedByUser = (likes = [], userId) =>
  Array.isArray(likes)
    ? likes.some((like) => {
        if (!userId) return false;
        if (typeof like === "string") return like === userId;
        return like?._id === userId || like?.toString?.() === userId;
      })
    : false;

const PostDetailModal = ({ post, currentUser, onClose, onLike }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const emojiList = ["😀", "😂", "😍", "🔥", "👏", "😭"];

  const likeCount = Number(post?.likes?.length) || 0;
  const liked = useMemo(
    () => isLikedByUser(post?.likes, currentUser?._id),
    [currentUser?._id, post?.likes]
  );

  useEffect(() => {
    let mounted = true;

    const loadComments = async () => {
      if (!post?._id) return;

      try {
        setLoadingComments(true);
        const res = await API.get(`/api/comments/${post._id}`);

        if (mounted) {
          setComments(res.data || []);
        }
      } catch (error) {
        console.log("Modal comments error:", error);
        if (mounted) setComments([]);
      } finally {
        if (mounted) setLoadingComments(false);
      }
    };

    setCommentText("");
    setEmojiOpen(false);
    setMenuOpen(false);
    loadComments();

    return () => {
      mounted = false;
    };
  }, [post?._id]);

  const handleLike = async () => {
    if (!post?._id || !onLike) return;
    await onLike(post._id);
  };

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !post?._id) return;

    try {
      setSubmitting(true);
      const res = await API.post(`/api/comments/${post._id}`, { text });

      setComments((current) => [res.data, ...current]);
      setCommentText("");
      setEmojiOpen(false);

      window.dispatchEvent(new Event("posts-changed"));
      window.dispatchEvent(new Event("notifications-changed"));
    } catch (error) {
      console.log("Add comment error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post?._id) return;

    try {
      setActionLoading("delete");
      await API.delete(`/api/posts/${post._id}`);
      window.dispatchEvent(new Event("posts-changed"));
      window.dispatchEvent(new Event("notifications-changed"));
      onClose();
    } catch (error) {
      console.log("Delete from modal error:", error);
    } finally {
      setActionLoading("");
      setMenuOpen(false);
    }
  };

  const handleEditPost = () => {
    setMenuOpen(false);
    onClose();
    navigate(`/edit-post/${post._id}`);
  };

  const handleGoToPost = () => {
    setMenuOpen(false);
    onClose();
    navigate("/home");
  };

  if (!post) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.media}>
          <img
            src={getImageUrl(post.image)}
            alt={post.caption || "post"}
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.author}>
              <img
                src={getImageUrl(post.author?.avatar)}
                alt={post.author?.username || "user"}
                className={styles.avatar}
              />
              <div className={styles.authorText}>
                <p className={styles.username}>{post.author?.username || "unknown"}</p>
                <span className={styles.time}>{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen(true)}
              aria-label="Post options"
            >
              <MoreHorizIcon />
            </button>
          </div>

          <div className={styles.commentsSection}>
            <div className={styles.comment}>
              <img
                src={getImageUrl(post.author?.avatar)}
                alt={post.author?.username || "user"}
                className={styles.commentAvatar}
              />
              <div className={styles.commentBody}>
                <p className={styles.commentText}>
                  <strong>{post.author?.username || "unknown"}</strong>{" "}
                  {post.caption || "No caption"}
                </p>
                <span className={styles.commentTime}>
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>

            {loadingComments ? (
              <p className={styles.loading}>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <img
                    src={getImageUrl(comment.user?.avatar)}
                    alt={comment.user?.username || "user"}
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentBody}>
                    <p className={styles.commentText}>
                      <strong>{comment.user?.username || "user"}</strong>{" "}
                      {comment.text}
                    </p>
                    <span className={styles.commentTime}>
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyComments}>No comments yet.</p>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.actions}>
              <button type="button" className={styles.iconButton} onClick={handleLike}>
                {liked ? <FavoriteIcon className={styles.likedIcon} /> : <FavoriteBorderIcon />}
              </button>
              <button type="button" className={styles.iconButton}>
                <ChatBubbleOutlineIcon />
              </button>
            </div>

            <div className={styles.meta}>
              <p className={styles.likes}>{likeCount} likes</p>
              <p className={styles.postTime}>{formatRelativeTime(post.createdAt)}</p>
            </div>

            <div className={styles.composer}>
              <button
                type="button"
                className={styles.emojiButton}
                onClick={() => setEmojiOpen((current) => !current)}
              >
                😊
              </button>

              {emojiOpen && (
                <div className={styles.emojiPanel}>
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={styles.emojiOption}
                      onClick={() => setCommentText((current) => `${current}${emoji}`)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Add comment..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddComment();
                  }
                }}
                className={styles.input}
              />

              <button
                type="button"
                className={styles.sendButton}
                onClick={handleAddComment}
                disabled={submitting || !commentText.trim()}
              >
                {submitting ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div
            className={styles.menuOverlay}
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(false);
            }}
          >
            <div
              className={styles.menuCard}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={`${styles.menuItem} ${styles.menuDanger}`}
                onClick={handleDeletePost}
                disabled={actionLoading === "delete"}
              >
                {actionLoading === "delete" ? "Deleting..." : "Delete"}
              </button>

              <button
                type="button"
                className={styles.menuItem}
                onClick={handleEditPost}
              >
                Edit
              </button>

              <button
                type="button"
                className={styles.menuItem}
                onClick={handleGoToPost}
              >
                Go to post
              </button>

              <button
                type="button"
                className={styles.menuItem}
                onClick={() => setMenuOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
