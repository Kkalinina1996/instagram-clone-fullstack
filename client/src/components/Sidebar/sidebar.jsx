import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./sidebar.module.css";

// icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // 🔥 ПРАВИЛЬНЫЙ ЗАПРОС
        const res = await API.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("User error:", err);
      }
    };

    getUser();
  }, []);

  return (
    <div className={styles.sidebar}>
      
      {/* LOGO */}
      <img src="/logo.png" alt="logo" className={styles.logo} />

      {/* NAV */}
      <nav className={styles.nav}>

        <NavLink to="/home" className={styles.link}>
          <HomeOutlinedIcon />
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className={styles.link}>
          <SearchOutlinedIcon />
          <span>Search</span>
        </NavLink>

        <NavLink to="/explore" className={styles.link}>
          <ExploreOutlinedIcon />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/messages" className={styles.link}>
          <ChatBubbleOutlineIcon />
          <span>Messages</span>
        </NavLink>

        <NavLink to="/notifications" className={styles.link}>
          <FavoriteBorderIcon />
          <span>Notification</span>
        </NavLink>

        <NavLink to="/create" className={styles.link}>
          <AddBoxOutlinedIcon />
          <span>Create</span>
        </NavLink>

        {/* PROFILE */}
        <NavLink to="/profile" className={styles.link}>
          <img
            src={
              user?.avatar
                ? `http://127.0.0.1:3333${user.avatar}`
                : "/avatar.png"
            }
            alt="avatar"
            className={styles.avatar}
          />
          <span>Profile</span>
        </NavLink>

      </nav>
    </div>
  );
}