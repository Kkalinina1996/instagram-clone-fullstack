import { useEffect, useState } from "react";
import API from "../../api/axios";
import styles from "./editProfile.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const EditProfile = () => {
  const [form, setForm] = useState({
    username: "",
    website: "",
    bio: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get("/users/me");
      setForm(res.data);
      setPreview(res.data.avatar);
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("website", form.website);
      formData.append("bio", form.bio);

      if (file) {
        formData.append("avatar", file);
      }

      await API.put("/users/me", formData);

      setOpen(true); // ✅ snackbar
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit profile</h2>

      {/* TOP */}
      <div className={styles.top}>
        <div className={styles.user}>
          <img
            src={
              preview
                ? preview.startsWith("http")
                  ? preview
                  : `http://127.0.0.1:3333${preview}`
                : "/avatar.png"
            }
            className={styles.avatar}
          />

          <div>
            <h4>{form.username}</h4>
            <p className={styles.bioSmall}>{form.bio}</p>
          </div>
        </div>

        <label className={styles.uploadBtn}>
          New photo
          <input type="file" hidden onChange={handleImage} />
        </label>
      </div>

      {/* FORM */}
      <div className={styles.form}>
        <label>Username</label>
        <TextField
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
        />

        <label>Website</label>
        <TextField
          name="website"
          value={form.website}
          onChange={handleChange}
          fullWidth
        />

        <label>About</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className={styles.textarea}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* 🔥 SNACKBAR */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Profile updated successfully ✅
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditProfile;