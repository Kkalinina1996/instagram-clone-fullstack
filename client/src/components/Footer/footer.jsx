import styles from "./footer.module.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/explore">Explore</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/create">Create</NavLink>
      </nav>

      <p className={styles.copy}>© 2024 ICHgram</p>
    </footer>
  );
};

export default Footer;