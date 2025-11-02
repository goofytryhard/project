import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import mockApi from "../mockApi";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], in_progress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!projectId) {
      alert("프로젝트 ID가 필요합니다.");
      navigate("/main");
      return;
    }
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [userResult, projectsResult] = await Promise.all([
        mockApi.getCurrentUser(),
        mockApi.getProjects()
      ]);

      if (userResult.error) {
        navigate("/login");
        return;
      }

      setUser(userResult.user);
      
      // 프로젝트 찾기
      const foundProject = projectsResult.projects.find(p => p._id === projectId);
      if (!foundProject) {
        alert("프로젝트를 찾을 수 없습니다.");
        navigate("/main");
        return;
      }
      
      setProject(foundProject);
      
      // Mock 태스크 데이터 생성
      const mockTasks = {
        todo: [
          { _id: "1", title: "프로젝트 기획서 작성", description: "프로젝트의 전체적인 방향성과 목표를 정리", assignees: [foundProject.members[0].user], createdBy: foundProject.members[0].user },
          { _id: "2", title: "UI/UX 디자인", description: "사용자 인터페이스 및 사용자 경험 설계", assignees: [foundProject.members[1].user], createdBy: foundProject.members[0].user }
        ],
        in_progress: [
          { _id: "3", title: "데이터베이스 설계", description: "효율적인 데이터 구조 및 관계 설계", assignees: [foundProject.members[0].user], createdBy: foundProject.members[1].user }
        ],
        done: [
          { _id: "4", title: "개발 환경 설정", description: "프로젝트 개발을 위한 환경 구축 완료", assignees: [foundProject.members[0].user], createdBy: foundProject.members[0].user }
        ]
      };
      
      setTasks(mockTasks);
    } catch (err) {
      console.error("데이터 로드 오류:", err);
      alert("프로젝트를 불러올 수 없습니다.");
      navigate("/main");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      _id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignees: [user],
      createdBy: user
    };

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, task]
    }));

    setNewTask({ title: "", description: "" });
    setShowCreateTask(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => {
      const allTasks = [...prev.todo, ...prev.in_progress, ...prev.done];
      const task = allTasks.find(t => t._id === taskId);
      
      if (!task) return prev;

      const newTasks = { todo: [], in_progress: [], done: [] };
      
      allTasks.forEach(t => {
        if (t._id === taskId) {
          newTasks[newStatus].push(t);
        } else {
          const currentStatus = prev.todo.includes(t) ? 'todo' : 
                              prev.in_progress.includes(t) ? 'in_progress' : 'done';
          newTasks[currentStatus].push(t);
        }
      });

      return newTasks;
    });
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    // Mock 사용자 검색 결과
    const mockUsers = [
      { _id: "6", userId: "newuser1", name: "이철수", email: "chulsoo@example.com" },
      { _id: "7", userId: "newuser2", name: "박영희", email: "younghee@example.com" }
    ];
    
    const results = mockUsers.filter(user => 
      user.name.includes(searchQuery) || 
      user.userId.includes(searchQuery) ||
      user.email.includes(searchQuery)
    );
    
    setSearchResults(results);
  };

  const handleInviteMember = (userId) => {
    alert(`${userId}님을 초대했습니다!`);
    setShowInviteMember(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const isAdmin = project?.members.find(m => m.user._id === user?._id)?.role === 'admin';

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
    <div style={{ minHeight: "100vh", width: "100vw", backgroundColor: "var(--gray-50)", margin: 0, overflow: "auto" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button 
                onClick={() => navigate("/main")}
                className="btn btn-ghost btn-sm"
                style={{ padding: "8px 12px" }}
              >
                ← 뒤로
              </button>
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
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="text-gray" style={{ fontSize: "14px" }}>
                {user?.name}님 👋
              </span>
              <button 
                onClick={() => {
                  mockApi.logout();
                  navigate("/login");
                }}
                className="btn btn-ghost btn-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: "32px", paddingBottom: "32px" }}>
        <div className="container">
          {/* 프로젝트 정보 섹션 */}
          <section className="mb-5">
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--gray-900)", marginBottom: "12px" }}>
                    {project?.name}
                  </h1>
                  <p className="text-gray" style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
                    {project?.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: "var(--gray-50)",
                      borderRadius: "var(--border-radius)",
                    }}>
                      <span style={{ fontSize: "16px" }}>👥</span>
                      <span style={{ fontSize: "14px", color: "var(--gray-600)", fontWeight: "500" }}>
                        팀원 {project?.members?.length}명
                      </span>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: isAdmin ? "var(--primary-color)" : "var(--gray-100)",
                      borderRadius: "var(--border-radius)",
                      color: isAdmin ? "white" : "var(--gray-600)"
                    }}>
                      <span style={{ fontSize: "16px" }}>{isAdmin ? "👑" : "👤"}</span>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        {isAdmin ? "관리자" : "멤버"}
                      </span>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setShowInviteMember(!showInviteMember)}
                      className="btn btn-secondary"
                    >
                      + 팀원 초대
                    </button>
                    <button className="btn btn-ghost">
                      ⚙️ 설정
                    </button>
                  </div>
                )}
              </div>

              {/* 팀원 목록 */}
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--gray-900)" }}>
                  팀원 목록
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {project?.members?.map((member, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 16px",
                        backgroundColor: "var(--white)",
                        border: "1px solid var(--gray-200)",
                        borderRadius: "var(--border-radius)",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: member.role === 'admin' ? "var(--primary-color)" : "var(--gray-400)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}>
                        {member.user.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--gray-900)" }}>
                          {member.user.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--gray-500)" }}>
                          {member.role === 'admin' ? '관리자' : '멤버'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 팀원 초대 폼 */}
              {showInviteMember && isAdmin && (
                <div style={{ 
                  marginTop: "24px",
                  padding: "20px", 
                  backgroundColor: "var(--gray-50)", 
                  borderRadius: "var(--border-radius)",
                  border: "1px solid var(--gray-200)"
                }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>팀원 초대</h4>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="사용자 이름, ID 또는 이메일로 검색"
                      className="input"
                      style={{ flex: 1 }}
                    />
                    <button onClick={handleSearchUsers} className="btn btn-primary">
                      검색
                    </button>
                  </div>
                  {searchResults.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      {searchResults.map(user => (
                        <div key={user._id} style={{ 
                          padding: "12px",
                          backgroundColor: "white",
                          marginBottom: "8px",
                          borderRadius: "var(--border-radius-sm)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border: "1px solid var(--gray-200)"
                        }}>
                          <div>
                            <strong>{user.name}</strong> ({user.userId})
                            {user.email && ` - ${user.email}`}
                          </div>
                          <button
                            onClick={() => handleInviteMember(user.userId)}
                            className="btn btn-primary btn-sm"
                          >
                            초대
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 태스크 관리 섹션 */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--gray-900)" }}>
                📋 태스크 관리
              </h2>
              <button
                onClick={() => setShowCreateTask(!showCreateTask)}
                className="btn btn-primary"
              >
                + 새 태스크
              </button>
            </div>

            {/* 태스크 생성 폼 */}
            {showCreateTask && (
              <div className="card slide-up mb-4" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>새 태스크 만들기</h3>
                <form onSubmit={handleCreateTask}>
                  <div className="mb-3">
                    <label style={{ 
                      display: "block", 
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--gray-700)"
                    }}>
                      태스크 제목 *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="태스크 제목을 입력해주세요"
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
                      설명
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="태스크에 대한 상세 설명을 입력해주세요"
                      className="input"
                      style={{ minHeight: "80px", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" className="btn btn-primary">
                      태스크 생성
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowCreateTask(false)} 
                      className="btn btn-secondary"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 칸반 보드 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {/* To Do 칼럼 */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "var(--border-radius)",
                padding: "20px",
                boxShadow: "var(--shadow)"
              }}>
                <h3 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "16px",
                  color: "var(--gray-700)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📝 To Do ({tasks.todo.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tasks.todo.map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onStatusChange={handleStatusChange}
                      availableStatuses={['in_progress']}
                      statusLabels={{ in_progress: '진행 중으로 →' }}
                    />
                  ))}
                </div>
              </div>

              {/* In Progress 칼럼 */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "var(--border-radius)",
                padding: "20px",
                boxShadow: "var(--shadow)"
              }}>
                <h3 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "16px",
                  color: "var(--warning)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🔄 In Progress ({tasks.in_progress.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tasks.in_progress.map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onStatusChange={handleStatusChange}
                      availableStatuses={['todo', 'done']}
                      statusLabels={{ todo: '← To Do로', done: '완료 →' }}
                    />
                  ))}
                </div>
              </div>

              {/* Done 칼럼 */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "var(--border-radius)",
                padding: "20px",
                boxShadow: "var(--shadow)"
              }}>
                <h3 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "16px",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  ✅ Done ({tasks.done.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tasks.done.map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onStatusChange={handleStatusChange}
                      availableStatuses={['in_progress']}
                      statusLabels={{ in_progress: '← 진행 중으로' }}
                      isDone={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// 태스크 카드 컴포넌트
function TaskCard({ task, onStatusChange, availableStatuses, statusLabels, isDone = false }) {
  return (
    <div style={{
      padding: "16px",
      backgroundColor: isDone ? "var(--gray-50)" : "var(--white)",
      border: "1px solid var(--gray-200)",
      borderRadius: "var(--border-radius-sm)",
      opacity: isDone ? 0.8 : 1
    }}>
      <h4 style={{ 
        fontSize: "14px", 
        fontWeight: "600", 
        marginBottom: "8px",
        textDecoration: isDone ? "line-through" : "none",
        color: "var(--gray-900)"
      }}>
        {task.title}
      </h4>
      <p style={{ 
        fontSize: "13px", 
        color: "var(--gray-600)", 
        marginBottom: "12px",
        lineHeight: "1.4"
      }}>
        {task.description}
      </p>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "var(--primary-color)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "10px",
            fontWeight: "bold"
          }}>
            {task.assignees[0]?.name?.charAt(0)}
          </div>
          <span style={{ fontSize: "12px", color: "var(--gray-600)" }}>
            {task.assignees[0]?.name}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {availableStatuses.map(status => (
          <button
            key={status}
            onClick={() => onStatusChange(task._id, status)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: "11px", padding: "4px 8px" }}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
