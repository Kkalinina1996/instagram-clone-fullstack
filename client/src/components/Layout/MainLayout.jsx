import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import Footer from "../Footer/footer";
import styles from "./styles.module.css";

const MainLayout = () => {
  return (
    <div className={styles.container}>
      
      <Sidebar />

      <div className={styles.main}>
        <main className={styles.content}>
          <Outlet />
        </main>

        {/* 🔥 FOOTER */}
        <Footer />
      </div>

    </div>
  );
};

export default MainLayout;