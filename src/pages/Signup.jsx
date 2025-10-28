
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>회원가입 화면</h2>
      <p>-이건또언제함-</p>
      <p>가입하기</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/external")}>
          (외부 업체) 계정으로 가입
        </button>
      </div>

      <h3>또는 이메일로 가입</h3>
      <input type="email" placeholder="이메일 입력" />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/main")}>생략 (메인 페이지 이동)</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/eaccount")}>Create egundo account</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login">이미 가입했습니까? 로그인</Link>
      </div>
    </div>
  );
}
