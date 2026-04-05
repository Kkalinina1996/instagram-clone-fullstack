import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./home.module.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPosts();
}, []);

  return (
    <div className={styles.container}>
      <div className={styles.feed}>
        {posts.map((post) => (
          <div key={post._id} className={styles.post}>
            {/* header */}
            <div className={styles.header}>
              <img
                src={post.author?.avatar || "/default-avatar.png"}
                alt=""
                className={styles.avatar}
              />
              <span>{post.author?.username}</span>
            </div>

            {/* image */}
            <img src={post.image} alt="" className={styles.image} />

            {/* actions */}
            <div className={styles.actions}>
              ❤️ 🤍 💬
            </div>

            {/* caption */}
            <div className={styles.caption}>
              <b>{post.author?.username}</b> {post.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;