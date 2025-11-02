import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mockApi from "../mockApi";

export default function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResult, projectsResult, statsResult] = await Promise.all([
        mockApi.getCurrentUser(),
        mockApi.getProjects(),
        mockApi.getUserStats()
      ]);

      if (userResult.error) {
        navigate("/login");
        return;
      }

      setUser(userResult.user);
      setProjects(projectsResult.projects || []);
      setStats(statsResult);
    } catch (err) {
      console.error("데이터 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await mockApi.logout();
    navigate("/login");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const result = await mockApi.createProject(newProject);
      if (!result.error) {
        alert("프로젝트가 생성되었습니다!");
        setShowCreateProject(false);
        setNewProject({ name: "", description: "" });
        loadData();
      }
    } catch (err) {
      alert("프로젝트 생성 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "var(--gray-50)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ width: "40px", height: "40px", margin: "0 auto 16px" }}></div>
          <p className="text-gray">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100vw",
      backgroundColor: "var(--gray-50)",
      margin: 0,
      overflow: "auto"
    }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--gray-200)",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)"
      }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--primary-color)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
              }}>
                C
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--gray-900)" }}>
                Co-Hub
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="text-gray" style={{ fontSize: "14px" }}>
                {user?.name}님 환영합니다! 👋
              </span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: "32px", paddingBottom: "32px" }}>
        <div className="container">
          {/* 개인 통계 대시보드 */}
          {stats && (
            <section className="mb-5">
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", color: "var(--gray-900)" }}>
                📊 나의 활동 현황
              </h2>
              <div className="grid grid-stats">
                <div className="card" style={{ padding: "28px", textAlign: "center" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    backgroundColor: "var(--primary-color)", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "24px"
                  }}>
                    📁
                  </div>
                  <h3 style={{ fontSize: "15px", color: "var(--gray-600)", marginBottom: "8px", fontWeight: "500" }}>참여 프로젝트</h3>
                  <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--primary-color)" }}>
                    {stats.projectCount}
                  </p>
                </div>
                
                <div className="card" style={{ padding: "28px", textAlign: "center" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    backgroundColor: "var(--success)", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "24px"
                  }}>
                    ✅
                  </div>
                  <h3 style={{ fontSize: "15px", color: "var(--gray-600)", marginBottom: "8px", fontWeight: "500" }}>완료한 태스크</h3>
                  <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--success)" }}>
                    {stats.completedTasks}
                  </p>
                </div>
                
                <div className="card" style={{ padding: "28px", textAlign: "center" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    backgroundColor: "var(--warning)", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "24px"
                  }}>
                    🔄
                  </div>
                  <h3 style={{ fontSize: "15px", color: "var(--gray-600)", marginBottom: "8px", fontWeight: "500" }}>진행 중 태스크</h3>
                  <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--warning)" }}>
                    {stats.inProgressTasks}
                  </p>
                </div>
                
                <div className="card" style={{ padding: "28px", textAlign: "center" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    backgroundColor: "var(--gray-500)", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "24px"
                  }}>
                    ⏱️
                  </div>
                  <h3 style={{ fontSize: "15px", color: "var(--gray-600)", marginBottom: "8px", fontWeight: "500" }}>총 활동 시간</h3>
                  <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--gray-700)" }}>
                    {stats.totalTime}<span style={{ fontSize: "16px", fontWeight: "400" }}>분</span>
                  </p>
                </div>
              </div>
          </section>
        )}

        {/* 프로젝트 섹션 */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--gray-900)" }}>
              🚀 내 프로젝트
            </h2>
            <button
              onClick={() => setShowCreateProject(!showCreateProject)}
              className="btn btn-primary"
            >
              + 새 프로젝트
            </button>
          </div>

          {showCreateProject && (
            <div className="card slide-up mb-4" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--gray-900)" }}>
                새 프로젝트 만들기
              </h3>
              <form onSubmit={handleCreateProject}>
                <div className="mb-3">
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--gray-700)"
                  }}>
                    프로젝트 이름 *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="프로젝트 이름을 입력해주세요"
                    required
                    className="input"
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
                    프로젝트 설명
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="프로젝트에 대한 간단한 설명을 입력해주세요"
                    className="input"
                    style={{ minHeight: "80px", resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" className="btn btn-primary">
                    프로젝트 생성
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateProject(false)} 
                    className="btn btn-secondary"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 프로젝트 카드 그리드 */}
          {projects.length > 0 ? (
            <div className="grid grid-projects">
              {projects.map((project) => (
                         <div
                           key={project._id}
                           className="card card-hover"
                           style={{ padding: "28px", minHeight: "200px", display: "flex", flexDirection: "column" }}
                           onClick={() => navigate(`/project?id=${project._id}`)}
                         >
                  <div style={{ flex: 1, marginBottom: "20px" }}>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "600", 
                      marginBottom: "12px",
                      color: "var(--gray-900)",
                      lineHeight: "1.3"
                    }}>
                      {project.name}
                    </h3>
                    <p className="text-gray" style={{ 
                      fontSize: "15px", 
                      lineHeight: "1.6",
                      marginBottom: "16px"
                    }}>
                      {project.description || "프로젝트 설명이 없습니다."}
                    </p>
                    
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      padding: "10px 14px",
                      backgroundColor: "var(--gray-50)",
                      borderRadius: "var(--border-radius-sm)",
                      width: "fit-content"
                    }}>
                      <span style={{ fontSize: "16px" }}>👥</span>
                      <span style={{ fontSize: "14px", color: "var(--gray-600)", fontWeight: "500" }}>
                        팀원 {project.members?.length}명
                      </span>
                    </div>
                  </div>
                  
                           <div style={{ display: "flex", gap: "10px" }}>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/project?id=${project._id}`);
                               }}
                               className="btn btn-primary btn-sm"
                               style={{ flex: 1 }}
                             >
                               📊 대시보드
                             </button>
                           </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ 
                fontSize: "48px", 
                marginBottom: "16px",
                opacity: 0.5
              }}>
                📁
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "var(--gray-700)" }}>
                아직 참여 중인 프로젝트가 없어요
              </h3>
              <p className="text-gray" style={{ marginBottom: "24px" }}>
                새 프로젝트를 생성하거나 팀원의 초대를 기다려주세요
              </p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="btn btn-primary"
              >
                첫 번째 프로젝트 만들기
              </button>
            </div>
          )}
        </section>
        </div>
      </main>
    </div>
  );
}
