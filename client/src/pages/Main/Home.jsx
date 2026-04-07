import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./home.module.css";

// MUI icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <div className={styles.post} key={post._id}>
          
          {/* HEADER */}
          <div className={styles.header}>
            <span className={styles.username}>
              {post.author?.username || "user"}
            </span>
          </div>

          {/* IMAGE */}
          <img
            src={
              post.image
                ? post.image.startsWith("http")
                  ? post.image
                  : `http://127.0.0.1:3333${post.image}`
                : "/no-image.png"
            }
            alt="post"
          />

          {/* ACTIONS */}
          <div className={styles.actions}>
            <FavoriteBorderIcon />
            <ChatBubbleOutlineIcon />
            <BookmarkBorderIcon />
          </div>

        </div>
      ))}
    </div>
  );
};

export default Home;