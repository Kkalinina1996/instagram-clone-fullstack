import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import API from "../../api/axios";
import homeStyles from "../Main/home.module.css";
import styles from "./search.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const formatCount = (count, singular, plural = `${singular}s`) => {
  const value = Number(count) || 0;
  return `${value} ${value === 1 ? singular : plural}`;
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [query, setQuery] = useState("");
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
        console.log("Search page error:", err);
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

  const recentUsers = useMemo(() => {
    const uniqueUsers = [];
    const seen = new Set();

    posts.forEach((post) => {
      const user = post.author;
      if (!user?._id || seen.has(user._id)) return;
      seen.add(user._id);
      uniqueUsers.push(user);
    });

    return uniqueUsers;
  }, [posts]);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return recentUsers.slice(0, 5);

    return recentUsers.filter((user) =>
      user.username?.toLowerCase().includes(normalized)
    );
  }, [query, recentUsers]);

  return (
    <section className={styles.wrapper}>
      <p className={styles.pageLabel}>Main - search</p>

      <div className={styles.stage}>
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.title}>Search</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => navigate("/home")}
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.input}
            />
          </div>

          <p className={styles.sectionLabel}>Recent</p>

          {loading ? (
            <p className={styles.emptyText}>Loading...</p>
          ) : filteredUsers.length > 0 ? (
            <div className={styles.list}>
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className={styles.userRow}
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={getImageUrl(user.avatar)}
                    alt={user.username}
                    className={styles.avatar}
                  />
                  <div className={styles.userText}>
                    <p className={styles.username}>{user.username}</p>
                    <span className={styles.meta}>Recent</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Nothing found.</p>
          )}
        </aside>

        <div className={styles.overlayFeed}>
          <button
            type="button"
            className={styles.overlayClose}
            onClick={() => navigate("/home")}
            aria-label="Close search panel"
          />

          <section className={homeStyles.page}>
            <div className={homeStyles.grid}>
              {posts.map((post) => (
                <article key={post._id} className={homeStyles.postCard}>
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
                        <span className={homeStyles.time}>2 week</span>
                      </div>
                    </div>

                    <button type="button" className={homeStyles.moreButton}>
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
                        onClick={() => handleToggleLike(post._id)}
                      >
                        <FavoriteBorderIcon />
                      </button>
                      <button type="button" className={homeStyles.actionButton}>
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
                    <p className={homeStyles.comments}>
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
      </div>
    </section>
  );
};

export default SearchPage;
