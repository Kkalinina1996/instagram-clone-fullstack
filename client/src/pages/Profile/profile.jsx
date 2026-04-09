import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./profile.module.css";
import Button from "@mui/material/Button";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await API.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("PROFILE ERROR:", err);
      }
    };

    getProfile();
  }, []);

  // 🔥 logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

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
          
          {/* TOP ROW */}
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            <Button variant="outlined" size="small">
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
            <span><b>0</b> posts</span>
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

      {/* POSTS GRID */}
      <div className={styles.grid}>
        {/* пока пусто — позже добавим посты */}
      </div>

    </div>
  );
};

export default Profile;