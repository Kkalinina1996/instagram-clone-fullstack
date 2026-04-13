import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import PostDetailModal from "../../components/PostDetailModal/PostDetailModal";
import styles from "./profile.module.css";
import Button from "@mui/material/Button";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  // 🔥 загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/api/users/me");
        setUser(userRes.data);

        const postsRes = await API.get("/api/posts");
        setPosts(postsRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const userPosts = useMemo(() => {
    if (!user) return [];

    return posts.filter((post) => {
      const authorId =
        typeof post.author === "object"
          ? post.author._id
          : post.author;

      return authorId === user._id;
    });
  }, [posts, user]);

  const selectedPost =
    userPosts.find((post) => post._id === selectedPostId) || null;

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        
        {/* AVATAR */}
        <div className={styles.avatarWrapper}>
          <img
            src={getImageUrl(user.avatar)}
            alt="avatar"
            className={styles.avatar}
          />
        </div>

        {/* INFO */}
        <div className={styles.info}>
          
          {/* TOP */}
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/edit-profile")}
            >
              Edit profile
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* STATS */}
          <div className={styles.stats}>
            <span><b>{userPosts.length}</b> posts</span>
            <span><b>{user.followers?.length || 0}</b> followers</span>
            <span><b>{user.following?.length || 0}</b> following</span>
          </div>

          {/* BIO */}
          <p className={styles.name}>{user.fullName}</p>
          <p className={styles.bio}>
            {user.bio || "No bio yet"}
          </p>

        </div>
      </div>

      {/* 🔥 POSTS GRID */}
      <div className={styles.grid}>
        {userPosts.map((post) => (
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
        ))}
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={user}
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

export default Profile;
