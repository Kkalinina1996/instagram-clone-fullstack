import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import styles from "./login.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 🔥 сброс ошибки

    try {
      const res = await API.post("api/auth/login", form);

      // 🔥 сохраняем токен
      localStorage.setItem("token", res.data.token);

      // 🔥 переход без перезагрузки
      navigate("/profile");

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className={styles.container}>
      
      {/* LEFT */}
      <div className={styles.left}>
        <img src="/phone.png" alt="phone" />
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        
        <div className={styles.card}>
          
          {/* LOGO */}
          <img src="/ICHGRA 2.png" className={styles.logo} />

          {/* FORM */}
          <form className={styles.form} onSubmit={handleLogin}>
            
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />

            {/* 🔥 ERROR */}
            {error && <p className={styles.error}>{error}</p>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Log in
            </Button>
          </form>

          {/* DIVIDER */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* FORGOT */}
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