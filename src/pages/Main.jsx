
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>메인 페이지</h2>
      <h3>프로젝트 선택</h3>
      <button
        onClick={() => navigate("/admin")}
        style={{ marginRight: "10px" }}
      >
        관리자 화면
      </button>
      <button onClick={() => navigate("/user")}>사용자 화면</button>
    </div>
  );
}
