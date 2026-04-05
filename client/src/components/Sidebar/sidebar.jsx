import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "250px",
      height: "100vh",
      borderRight: "1px solid #ddd",
      padding: "20px"
    }}>
      <h2>ICHGRAM</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/create">Create</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}