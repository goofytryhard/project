import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!projectId) {
      alert("프로젝트 ID가 필요합니다.");
      navigate("/main");
      return;
    }
    loadDashboard();
  }, [projectId]);

  const loadDashboard = async () => {
    try {
      const result = await api.getDashboard(projectId);
      setDashboard(result);
    } catch (err) {
      console.error("대시보드 로드 오류:", err);
      alert("대시보드를 불러올 수 없습니다.");
      navigate("/main");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const result = await api.searchUsers(searchQuery);
      setSearchResults(result.users || []);
    } catch (err) {
      alert("사용자 검색 중 오류가 발생했습니다.");
    }
  };

  const handleInvite = async (userId) => {
    try {
      await api.inviteMember(projectId, userId);
      alert("팀원을 초대했습니다!");
      setShowInvite(false);
      setSearchQuery("");
      setSearchResults([]);
      loadDashboard();
    } catch (err) {
      alert("초대 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>로딩 중...</div>;
  }

  const { project, taskStats, memberStats, recentActivities } = dashboard;

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <button onClick={() => navigate("/main")} style={{ marginRight: "15px", padding: "8px 15px" }}>
          ← 뒤로
        </button>
        <button onClick={() => navigate(`/user?projectId=${projectId}`)} style={{ marginRight: "15px", padding: "8px 15px" }}>
          작업 화면
        </button>
      </div>

      <h1>{project.name} - 관리자 대시보드</h1>
      <p style={{ color: "#666" }}>{project.description}</p>

      {/* 프로젝트 전체 현황 */}
      <div style={{ marginTop: "30px" }}>
        <h2>프로젝트 전체 현황</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "20px",
          marginTop: "15px"
        }}>
          <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>전체 태스크</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{taskStats.total}</p>
          </div>
          <div style={{ backgroundColor: "#fff3cd", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>To Do</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{taskStats.todo}</p>
          </div>
          <div style={{ backgroundColor: "#cfe2ff", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>In Progress</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{taskStats.in_progress}</p>
          </div>
          <div style={{ backgroundColor: "#d1e7dd", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Done</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{taskStats.done}</p>
          </div>
        </div>
      </div>

      {/* 개인별 기여도 통계 */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>개인별 기여도 통계</h2>
          <button
            onClick={() => setShowInvite(!showInvite)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            + 팀원 초대
          </button>
        </div>

        {showInvite && (
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "20px", 
            borderRadius: "8px",
            marginTop: "15px",
            marginBottom: "15px"
          }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="사용자 ID, 이름 또는 이메일로 검색"
                style={{ flex: 1, padding: "8px" }}
              />
              <button onClick={handleSearch} style={{ padding: "8px 20px" }}>
                검색
              </button>
            </div>
            {searchResults.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                {searchResults.map(user => (
                  <div key={user._id} style={{ 
                    padding: "10px",
                    backgroundColor: "white",
                    marginBottom: "5px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <strong>{user.name}</strong> ({user.userId})
                      {user.email && ` - ${user.email}`}
                    </div>
                    <button
                      onClick={() => handleInvite(user.userId)}
                      style={{
                        padding: "5px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      초대
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <table style={{ 
          width: "100%", 
          marginTop: "15px",
          borderCollapse: "collapse",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #ddd" }}>이름</th>
              <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #ddd" }}>역할</th>
              <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #ddd" }}>완료한 태스크</th>
              <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #ddd" }}>총 활동 시간 (분)</th>
              <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #ddd" }}>총 타이핑</th>
              <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #ddd" }}>활동 로그 수</th>
            </tr>
          </thead>
          <tbody>
            {memberStats.map((member, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px" }}>
                  {member.user.name} ({member.user.userId})
                </td>
                <td style={{ padding: "15px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    backgroundColor: member.role === "admin" ? "#ffc107" : "#6c757d",
                    color: "white"
                  }}>
                    {member.role === "admin" ? "관리자" : "멤버"}
                  </span>
                </td>
                <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                  {member.completedTasks}
                </td>
                <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                  {member.totalTime}
                </td>
                <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                  {member.totalTyping}
                </td>
                <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
                  {member.activityCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 최근 활동 */}
      <div style={{ marginTop: "40px" }}>
        <h2>최근 활동</h2>
        <div style={{ 
          marginTop: "15px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                borderBottom: index < recentActivities.length - 1 ? "1px solid #eee" : "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{activity.user?.name}</strong> - {activity.description}
                  {activity.task && (
                    <span style={{ color: "#666" }}> (태스크: {activity.task.title})</span>
                  )}
                </div>
                <div style={{ color: "#999", fontSize: "14px" }}>
                  {new Date(activity.timestamp).toLocaleString("ko-KR")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
