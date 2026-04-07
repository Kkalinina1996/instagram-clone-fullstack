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

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <img
          src={user.avatar || "/avatar.png"}
          className={styles.avatar}
        />

        <div className={styles.info}>
         <div className={styles.topRow}>
  <h2>{user.username}</h2>

  <div className={styles.buttons}>
    <Button variant="outlined" size="small">
      Edit Profile
    </Button>

    <Button
      variant="contained"
      size="small"
      color="error"
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
    >
      Logout
    </Button>
  </div>
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

          <p className={styles.name}>{user.fullName}</p>
          <p className={styles.bio}>{user.bio}</p>
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

      {/* GRID POSTS */}
      <div className={styles.grid}>
        {/* пока пусто */}
      </div>

    </div>
  );
};

export default Profile;