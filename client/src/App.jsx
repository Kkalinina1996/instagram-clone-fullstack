// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import Reset from "./pages/Auth/reset";
// import Profile from "./pages/Profile/profile";
// import Home from "./pages/Main/Home";

// const App = () => {
//   const isAuth = !!localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* 🔥 ГЛАВНАЯ = LOGIN */}
//         <Route
//           path="/"
//           element={!isAuth ? <Login /> : <Navigate to="/home" />}
//         />

//         {/* LOGIN */}
//         <Route
//           path="/login"
//           element={!isAuth ? <Login /> : <Navigate to="/profile" />}
//         />

//         {/* REGISTER */}
//         <Route
//           path="/register"
//           element={!isAuth ? <Register /> : <Navigate to="/profile" />}
//         />

//         {/* RESET */}
//         <Route path="/reset" element={<Reset />} />

//         {/* PRIVATE */}
//         <Route
//           path="/home"
//           element={isAuth ? <Login /> : <Navigate to="/" />}
//         />

//         <Route
//           path="/profile"
//           element={isAuth ? <Profile /> : <Navigate to="/" />}
//         />

//         {/* fallback */}
//         <Route
//           path="*"
//           element={<Navigate to={isAuth ? "/home" : "/"} />}
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// layout
import MainLayout from "./components/Layout/MainLayout";

// pages
import Home from "./pages/Main/Home";
import Profile from "./pages/Profile/profile";
import Explore from "./pages/Explore/Explore";

// auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reset from "./pages/Auth/reset";

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

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;