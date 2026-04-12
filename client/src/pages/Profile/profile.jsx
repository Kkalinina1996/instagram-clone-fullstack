import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./profile.module.css";
import Button from "@mui/material/Button";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

  // 🔥 delete post
  const deletePost = async (id) => {
    try {
      await API.delete(`/api/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  // 🔥 только свои посты
  const userPosts = posts.filter((post) => {
    const authorId =
      typeof post.author === "object"
        ? post.author._id
        : post.author;

    return authorId === user._id;
  });

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        
        {/* AVATAR */}
        <div className={styles.avatarWrapper}>
          <img
            src={
              user.avatar
                ? `http://127.0.0.1:3333${user.avatar}`
                : "/avatar.png"
            }
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
          <div key={post._id} className={styles.post}>
            
            <img
              src={`http://127.0.0.1:3333${post.image}`}
              alt="post"
            />

            <button
              className={styles.deleteBtn}
              onClick={() => deletePost(post._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Profile;
