import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    FullName: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className={styles.container}>
      {/* CARD */}
      <div className={styles.card}>
        <img src="/logo.png" className={styles.logo} />

        <p className={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="Full Name" placeholder="Full Name" onChange={handleChange} />
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Sign up</button>
        </form>

        {/* TERMS */}
        <p className={styles.terms}>
          People who use our service may have uploaded your contact
          information to Instagram. Learn More
        </p>

       <p className={styles.text}>
  By signing up, you agree to our{" "}
  <span>Terms</span>,{" "}
  <span>Privacy Policy</span> and{" "}
  <span>Cookies Policy</span>.
</p>
      </div>

      {/* LOGIN BOX */}
      <div className={styles.loginBox}>
        Have an account?{" "}
        <span onClick={() => navigate("/login")}>Log in</span>
      </div>
    </div>
  );
};

export default Register;