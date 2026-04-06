import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./profile.module.css";
import Button from "@mui/material/Button";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/users/me");
        setUser(userRes.data);

        const postsRes = await API.get("/posts");
        setPosts(postsRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      
      <div className={styles.content}>
        
        {/* HEADER */}
        <div className={styles.header}>
          
          {/* AVATAR */}
          <div className={styles.avatar}>
            <img
  src={
    user?.avatar
      ? `http://127.0.0.1:3333${user.avatar}`
      : "/avatar.png"
  }
  alt="avatar"
/>
          </div>

          {/* INFO */}
          <div className={styles.userInfo}>
            
            <div className={styles.topRow}>
              <span className={styles.username}>
                {user?.username}
              </span>
              

<Button variant="outlined" size="small">
  Edit profile
</Button>
            </div>

            <div className={styles.stats}>
              <span><b>{posts.length}</b> posts</span>
              <span><b>{user?.followers?.length || 0}</b> followers</span>
              <span><b>{user?.following?.length || 0}</b> following</span>
            </div>

            <div className={styles.bio}>
              {user?.bio || "No bio yet"}
            </div>

          </div>
        </div>

        {/* POSTS GRID */}
    <div className={styles.grid}>
  {posts.map((post) => (
    <div className={styles.post} key={post._id}>
      <img
        src={
          post.image.startsWith("http")
            ? post.image
            : `http://127.0.0.1:3333${post.image}`
        }
        alt="post"
      />
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Profile;