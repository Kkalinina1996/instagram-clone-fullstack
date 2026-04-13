import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./sidebar.module.css";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ExploreIcon from "@mui/icons-material/Explore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";

const NAV_ITEMS = [
  { to: "/home",          label: "Home",         icon: <HomeOutlinedIcon />,       activeIcon: <HomeIcon /> },
  { to: "/search",        label: "Search",       icon: <SearchOutlinedIcon />,     activeIcon: <SearchOutlinedIcon /> },
  { to: "/explore",       label: "Explore",      icon: <ExploreOutlinedIcon />,    activeIcon: <ExploreIcon /> },
  { to: "/messages",      label: "Messages",     icon: <ChatBubbleOutlineIcon />,  activeIcon: <ChatBubbleIcon /> },
  { to: "/notifications", label: "Notification", icon: <FavoriteBorderIcon />,     activeIcon: <FavoriteIcon /> },
  { to: "/create",        label: "Create",       icon: <AddBoxOutlinedIcon />,     activeIcon: <AddBoxIcon /> },
];

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("User error:", err);
      }
    };
    getUser();
  }, []);

  const avatarSrc = user?.avatar
    ? `http://127.0.0.1:3333${user.avatar}`
    : null;

  const initials = user?.username
    ? user.username.slice(0, 3).toUpperCase()
    : "ICH";

  return (
    <aside className={styles.sidebar}>
      {/* LOGO */}
      <img src="/ICHGRA 2.png" alt="Ichgram" className={styles.logo} />

      {/* NAV */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon, activeIcon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={styles.iconWrap}>
                  {isActive ? activeIcon : icon}
                </span>
                <span className={styles.label}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* PROFILE */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${styles.link} ${styles.profileLink} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className={`${styles.avatar} ${isActive ? styles.avatarActive : ""}`}
              />
            ) : (
              <div className={`${styles.avatarFallback} ${isActive ? styles.avatarActive : ""}`}>
                {initials}
              </div>
            )}
            <span className={styles.label}>Profile</span>
          </>
        )}
      </NavLink>
    </aside>
  );
}