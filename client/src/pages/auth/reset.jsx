import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./reset.module.css";

const Reset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    console.log("RESET EMAIL:", email);

    // позже подключим API
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
      <img src="/trouble.png" className={styles.icon} />

        {/* TITLE */}
        <h3>Trouble logging in?</h3>

        {/* TEXT */}
        <p className={styles.subtitle}>
          Enter your email, phone, or username and we’ll send you a link to get back into your account.
        </p>

        {/* FORM */}
        <form onSubmit={handleReset} className={styles.form}>
          <input
            placeholder="Email, phone, or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Reset your password</button>
        </form>

        {/* OR */}
        <div className={styles.or}>OR</div>

        {/* CREATE */}
        <span
          className={styles.link}
          onClick={() => navigate("/register")}
        >
          Create new account
        </span>
      </div>

      {/* BACK */}
      <div className={styles.bottom}>
        <span onClick={() => navigate("/login")}>
          Back to login
        </span>
      </div>
    </div>
  );
};

export default Reset;