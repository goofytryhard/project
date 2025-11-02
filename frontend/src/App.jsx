// src/App.jsx

import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Admin from "./pages/Admin";
import User from "./pages/User";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
          <Route path="/project" element={<ProjectDetail />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "20px", textAlign: "center", marginTop: "50px" }}>
                <h2>404 - 페이지를 찾을 수 없습니다</h2>
                <Link to="/">홈으로 돌아가기</Link>
              </div>
            }
          />
        </Routes>
    </div>
  );
}
