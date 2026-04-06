import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

// MUI icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import MessageIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonIcon from "@mui/icons-material/Person";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>ICHGRAM</h2>

      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>
          <HomeIcon /> Home
        </Link>

        <Link to="/search" className={styles.link}>
          <SearchIcon /> Search
        </Link>

        <Link to="/explore" className={styles.link}>
          <ExploreIcon /> Explore
        </Link>

        <Link to="/messages" className={styles.link}>
          <MessageIcon /> Messages
        </Link>

        <Link to="/notifications" className={styles.link}>
          <FavoriteIcon /> Notifications
        </Link>

        <Link to="/create" className={styles.link}>
          <AddBoxIcon /> Create
        </Link>

        <Link to="/profile" className={styles.link}>
          <PersonIcon /> Profile
        </Link>
      </nav>
    </div>
  );
}