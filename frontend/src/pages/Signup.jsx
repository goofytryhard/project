import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mockApi from "../mockApi";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await mockApi.signup(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      margin: 0,
      overflow: "auto"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "420px", 
        margin: "0 auto" 
      }}>
        <div className="card fade-in" style={{ padding: "40px" }}>
          {/* 로고 영역 */}
          <div className="text-center mb-4">
            <div style={{
              width: "60px",
              height: "60px",
              backgroundColor: "var(--primary-color)",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold"
            }}>
              C
            </div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "var(--gray-900)",
              marginBottom: "8px"
            }}>
              회원가입
            </h1>
            <p className="text-gray" style={{ fontSize: "16px" }}>
              협업의 새로운 허브, Co-Hub에 오신 것을 환영합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--gray-700)"
              }}>
                사용자 ID *
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="사용자 ID를 입력해주세요"
                required
                className="input"
                autoComplete="username"
              />
            </div>

            <div className="mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--gray-700)"
              }}>
                비밀번호 *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="안전한 비밀번호를 입력해주세요"
                required
                className="input"
                autoComplete="new-password"
              />
            </div>

            <div className="mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--gray-700)"
              }}>
                이름 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="실명을 입력해주세요"
                required
                className="input"
                autoComplete="name"
              />
            </div>

            <div className="mb-4">
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--gray-700)"
              }}>
                이메일 (선택)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일 주소를 입력해주세요"
                className="input"
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="alert alert-error mb-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="spinner"></div>
                  가입 중...
                </div>
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray">
              이미 계정이 있으신가요?{" "}
              <Link 
                to="/login" 
                className="text-primary"
                style={{ 
                  textDecoration: "none", 
                  fontWeight: "600",
                  borderBottom: "1px solid var(--primary-color)"
                }}
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
