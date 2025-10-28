// src/App.jsx

import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ExternalService from "./pages/ExternalService";
import Main from "./pages/Main";
import Admin from "./pages/Admin";
import User from "./pages/User";
import EAccount from "./pages/EAccount";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/external" element={<ExternalService />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/eaccount" element={<EAccount />} />
        <Route
          path="*"
          element={
            <div>
              <h2>404 - 페이지 없음</h2>
              <Link to="/">홈으로 돌아가기</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
