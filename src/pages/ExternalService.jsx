
import { useNavigate } from "react-router-dom";

export default function ExternalService() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>(외부 업체) 서비스 페이지</h2>
      <p>로그인 성공 시 메인 페이지로 이동 (현재는 버튼으로 대체)</p>
      <button onClick={() => navigate("/main")}>생략 (메인 페이지 이동)</button>
    </div>
  );
}
