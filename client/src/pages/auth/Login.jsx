import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import styles from "./login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/"); // редирект на главную
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  return (
    <div className={styles.container}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <img src="/phone.png" alt="phone" />
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <div className={styles.card}>
          {/* LOGO */}
          <img src="/ICHGRA 2.png" className={styles.logo} />

          {/* FORM */}
          <form className={styles.form} onSubmit={handleLogin}>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button type="submit">Log in</button>
          </form>

          {/* DIVIDER */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* FORGOT PASSWORD */}
          <Link to="/reset" className={styles.forgot}>
            Forgot password?
          </Link>
        </div>

        {/* SIGN UP */}
        <div className={styles.signupBox}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;