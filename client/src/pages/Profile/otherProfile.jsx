import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
import styles from "./otherProfile.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const OtherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, userRes, postsRes] = await Promise.all([
          API.get("/api/users/me"),
          API.get(`/api/users/${id}`),
          API.get("/api/posts"),
        ]);

        setCurrentUser(meRes.data || null);
        setUser(userRes.data || null);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.log("Other profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const userPosts = useMemo(() => {
    return posts.filter((post) => {
      const authorId =
        typeof post.author === "object" ? post.author._id : post.author;

      return authorId === id;
    });
  }, [id, posts]);

  const selectedPost =
    userPosts.find((post) => post._id === selectedPostId) || null;

  const isFollowing = useMemo(() => {
    return currentUser?.following?.some((item) => {
      if (typeof item === "string") return item === id;
      return item?._id === id || item?.toString?.() === id;
    });
  }, [currentUser, id]);

  const handleToggleFollow = async () => {
    try {
      setFollowLoading(true);
      await API.post(`/api/follow/${id}`);

      setCurrentUser((prev) => {
        if (!prev) return prev;

        const alreadyFollowing = prev.following?.some((item) => {
          if (typeof item === "string") return item === id;
          return item?._id === id || item?.toString?.() === id;
        });

        return {
          ...prev,
          following: alreadyFollowing
            ? (prev.following || []).filter((item) => {
                if (typeof item === "string") return item !== id;
                return item?._id !== id && item?.toString?.() !== id;
              })
            : [...(prev.following || []), id],
        };
      });

      setUser((prev) => {
        if (!prev) return prev;

        const alreadyFollower = prev.followers?.some((item) => {
          if (typeof item === "string") return item === currentUser?._id;
          return item?._id === currentUser?._id || item?.toString?.() === currentUser?._id;
        });

        return {
          ...prev,
          followers: alreadyFollower
            ? (prev.followers || []).filter((item) => {
                if (typeof item === "string") return item !== currentUser?._id;
                return item?._id !== currentUser?._id && item?.toString?.() !== currentUser?._id;
              })
            : [...(prev.followers || []), currentUser?._id || "me"],
        };
      });

      window.dispatchEvent(new Event("notifications-changed"));
    } catch (err) {
      console.log("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>User not found</h2>
          <button type="button" onClick={() => navigate("/search")}>
            Back to search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img
            src={getImageUrl(user.avatar)}
            alt={user.username}
            className={styles.avatar}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            <button
              type="button"
              className={styles.followBtn}
              onClick={handleToggleFollow}
              disabled={followLoading}
            >
              {followLoading
                ? "Loading..."
                : isFollowing
                  ? "Unfollow"
                  : "Follow"}
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate("/messages")}
            >
              Message
            </button>
          </div>

          <div className={styles.stats}>
            <span><b>{userPosts.length}</b> posts</span>
            <span><b>{user.followers?.length || 0}</b> followers</span>
            <span><b>{user.following?.length || 0}</b> following</span>
          </div>

          <p className={styles.name}>{user.fullName || user.username}</p>
          <p className={styles.bio}>{user.bio || "No bio yet"}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div
              key={post._id}
              className={styles.post}
              onClick={() => setSelectedPostId(post._id)}
            >
              <img
                src={getImageUrl(post.image)}
                alt="post"
              />
            </div>
          ))
        ) : (
          <div className={styles.emptyPosts}>This user has no posts yet.</div>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPostId(null)}
          onLike={async (postId) => {
            await API.post(`/api/likes/${postId}`);
            const postsRes = await API.get("/api/posts");
            setPosts(postsRes.data || []);
            window.dispatchEvent(new Event("notifications-changed"));
            window.dispatchEvent(new Event("posts-changed"));
          }}
        />
      )}
    </div>
  );
};

export default OtherProfile;
