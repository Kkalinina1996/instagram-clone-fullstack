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

    window.location.href = "/profile"; 

  } catch (err) {
    alert(err.response?.data?.message);
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