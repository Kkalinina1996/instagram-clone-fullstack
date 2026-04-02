import AuthLayout from "../../components/layout/AuthLayout";
import styles from "../../styles/auth.module.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <AuthLayout>
      <div className={styles.box}>
        <h1 className={styles.logo}>ICHIGRAM</h1>

        <p className={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </p>

        <form className={styles.form}>
          <input type="text" placeholder="Mobile Number or Email" />
          <input type="text" placeholder="Full Name" />
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <button type="submit">Sign up</button>
        </form>

        <div className={styles.divider}>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <p className={styles.terms}>
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </div>

      <div className={styles.bottomBox}>
        Have an account? <Link to="/">Log in</Link>
      </div>
    </AuthLayout>
  );
}