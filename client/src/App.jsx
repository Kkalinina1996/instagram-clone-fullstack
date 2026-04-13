
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// layout
import MainLayout from "./components/Layout/MainLayout";

// pages
import Home from "./pages/Main/Home";
import Profile from "./pages/Profile/profile";
import OtherProfile from "./pages/Profile/otherProfile";
import Explore from "./pages/Explore/explore";
import Create from "./pages/Create/create";
import Notifications from "./pages/Notifications/notifications";
import SearchPage from "./pages/Search/search";
import Messages from "./pages/Messages/messages";

// auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reset from "./pages/Auth/reset"
import EditProfile from "./pages/Profile/editProfile";

const getAuthState = () => !!localStorage.getItem("token");

function App() {
  const [isAuth, setIsAuth] = useState(getAuthState);

  useEffect(() => {
    const syncAuth = () => {
      setIsAuth(getAuthState());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* 👉 ПЕРВАЯ СТРАНИЦА */}
        <Route
          path="/"
          element={!isAuth ? <Login /> : <Navigate to="/home" />}
        />

        {/* 🔐 auth */}
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/register"
          element={!isAuth ? <Register /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/reset"
          element={!isAuth ? <Reset /> : <Navigate to="/profile" replace />}
        />

        {/* 🔥 страницы с sidebar */}
        <Route element={<MainLayout />}>
        <Route
          path="/edit-profile"
          element={isAuth ? <EditProfile /> : <Navigate to="/" replace />}
        />
          <Route
            path="/home"
            element={isAuth ? <Home /> : <Navigate to="/" replace />}
          />
          <Route
            path="/search"
            element={isAuth ? <SearchPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/profile"
            element={isAuth ? <Profile /> : <Navigate to="/" replace />}
          />
          <Route
            path="/user/:id"
            element={isAuth ? <OtherProfile /> : <Navigate to="/" replace />}
          />

          <Route
            path="/explore"
            element={isAuth ? <Explore /> : <Navigate to="/" replace />}
          />
          <Route
            path="/notifications"
            element={isAuth ? <Notifications /> : <Navigate to="/" replace />}
          />
          <Route
            path="/messages"
            element={isAuth ? <Messages /> : <Navigate to="/" replace />}
          />
          <Route
  path="/create"
  element={isAuth ? <Create /> : <Navigate to="/" replace />}
/>

        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
