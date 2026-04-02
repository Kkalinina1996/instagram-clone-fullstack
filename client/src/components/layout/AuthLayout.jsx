import styles from "../../styles/auth.module.css"

export default function AuthLayout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src="/phone.png" alt="phone" />
      </div>

      <div className={styles.right}>
        {children}
      </div>
    </div>
  );
}