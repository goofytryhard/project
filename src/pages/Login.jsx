
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>로그인 화면</h2>
      <button onClick={() => navigate("/external")}>
        (외부 업체) 계정으로 로그인
      </button>

      <h3>또는 이메일로 로그인</h3>
      <input type="email" placeholder="이메일 입력" />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/main")}>생략 (메인 페이지 이동)</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/eaccount")}>Login with egundo account</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/">계정이 없다면 가입하세요</Link>
      </div>
    </div>
  );
}
