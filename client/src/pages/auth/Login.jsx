import AuthLayout from "../../components/layout/AuthLayout";
import styles from "../../styles/auth.module.css";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AuthLayout>
      <div className={styles.box}>
        <h1 className={styles.logo}>ICHIGRAM</h1>

        <form className={styles.form}>
          <input type="text" placeholder="Phone number, username, or email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Log in</button>
        </form>

        <div className={styles.divider}>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <a className={styles.link}>Forgot password?</a>
      </div>

      <div className={styles.bottomBox}>
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </AuthLayout>
  );
}