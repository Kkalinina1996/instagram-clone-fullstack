


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// layout
import MainLayout from "./components/Layout/MainLayout";

// pages
import Home from "./pages/Main/Home";
import Profile from "./pages/Profile/profile";
import Explore from "./pages/Explore/explore";
import Create from "./pages/Create/create";
import Notifications from "./pages/Notifications/notifications";

// auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reset from "./pages/Auth/reset"
import EditProfile from "./pages/Profile/editProfile";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* 👉 ПЕРВАЯ СТРАНИЦА */}
        <Route
          path="/"
          element={!isAuth ? <Login /> : <Navigate to="/home" />}
        />

        {/* 🔐 auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />

        {/* 🔥 страницы с sidebar */}
        <Route element={<MainLayout />}>
        <Route path="/edit-profile" element={<EditProfile />} />
          <Route
            path="/home"
            element={isAuth ? <Home /> : <Navigate to="/" />}
          />

          <Route
            path="/profile"
            element={isAuth ? <Profile /> : <Navigate to="/" />}
          />

          <Route
            path="/explore"
            element={isAuth ? <Explore /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={isAuth ? <Notifications /> : <Navigate to="/" />}
          />
          <Route
  path="/create"
  element={isAuth ? <Create /> : <Navigate to="/" />}
/>

        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
