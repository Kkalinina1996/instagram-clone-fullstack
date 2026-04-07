import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import styles from "./styles.module.css";

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;