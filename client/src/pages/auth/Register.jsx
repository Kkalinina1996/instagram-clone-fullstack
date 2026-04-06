import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import styles from "./register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  // 🔥 ошибки по каждому полю
  const [errors, setErrors] = useState({});

  // 🔁 изменение input
  const handleChange = (e) => {
    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ ВАЛИДАЦИЯ
  const validate = () => {
    const newErrors = {};

    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (form.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    return newErrors;
  };

  // 🚀 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    // ❌ если есть ошибки — стоп
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cleanForm = {
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
    };

    try {
      const res = await API.post("/auth/register", cleanForm);

      localStorage.setItem("token", res.data.token);

      navigate("/"); 
    } catch (err) {
      const message = err.response?.data?.message;

      // 🔥 backend ошибки распределяем
      if (message.includes("username")) {
        setErrors({ username: message });
      } else if (message.includes("Email")) {
        setErrors({ email: message });
      } else {
        setErrors({ general: message || "Registration error" });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.png" className={styles.logo} alt="logo" />

        <p className={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          
          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          {/* FULL NAME */}
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className={errors.fullName ? styles.inputError : ""}
          />
          {errors.fullName && (
            <p className={styles.error}>{errors.fullName}</p>
          )}

          {/* USERNAME */}
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className={errors.username ? styles.inputError : ""}
          />
          {errors.username && (
            <p className={styles.error}>{errors.username}</p>
          )}

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className={errors.password ? styles.inputError : ""}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password}</p>
          )}

          {/* ОБЩАЯ ОШИБКА */}
          {errors.general && (
            <p className={styles.error}>{errors.general}</p>
          )}

          <button type="submit">Sign up</button>
        </form>

        {/* TERMS */}
        <p className={styles.terms}>
          People who use our service may have uploaded your contact
          information to Instagram.{" "}
          <span className={styles.link}>Learn More</span>
        </p>

        <p className={styles.text}>
          By signing up, you agree to our{" "}
          <span className={styles.link}>Terms</span>,{" "}
          <span className={styles.link}>Privacy Policy</span> and{" "}
          <span className={styles.link}>Cookies Policy</span>.
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