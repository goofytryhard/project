import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function User() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], in_progress: [], done: [] });
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      alert("프로젝트 ID가 필요합니다.");
      navigate("/main");
      return;
    }
    loadData();
    
    // 세션 시작 기록
    api.trackActivity({ projectId, action: "session_start" });

    // 페이지 나갈 때 세션 종료 기록
    return () => {
      api.trackActivity({ projectId, action: "session_end" });
    };
  }, [projectId]);

  const loadData = async () => {
    try {
      const [projectResult, tasksResult] = await Promise.all([
        api.getProject(projectId),
        api.getTasks(projectId)
      ]);

      setProject(projectResult.project);
      
      // 태스크를 상태별로 그룹화
      const grouped = {
        todo: [],
        in_progress: [],
        done: []
      };
      
      tasksResult.tasks.forEach(task => {
        grouped[task.status].push(task);
      });
      
      setTasks(grouped);
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
    try {
      const result = await api.createTask({
        projectId,
        ...newTask
      });
      
      if (!result.error) {
        setShowCreateTask(false);
        setNewTask({ title: "", description: "" });
        loadData();
      }
    } catch (err) {
      alert("태스크 생성 중 오류가 발생했습니다.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      
      // 타이핑 카운트 증가
      api.trackActivity({ projectId, action: "typing", metadata: { count: 10 } });
      
      loadData();
    } catch (err) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await api.deleteTask(taskId);
      loadData();
    } catch (err) {
      alert("태스크 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>로딩 중...</div>;
  }

  const columnStyle = {
    flex: 1,
    minWidth: "300px",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px"
  };

  const taskCardStyle = {
    backgroundColor: "white",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "move"
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <button onClick={() => navigate("/main")} style={{ marginRight: "15px", padding: "8px 15px" }}>
            ← 뒤로
          </button>
          <h1 style={{ display: "inline" }}>{project?.name}</h1>
        </div>
        <button
          onClick={() => setShowCreateTask(!showCreateTask)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          + 새 태스크
        </button>
      </div>

      {showCreateTask && (
        <form onSubmit={handleCreateTask} style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>태스크 제목</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>설명</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              style={{ width: "100%", padding: "8px", minHeight: "80px" }}
            />
          </div>
          <button type="submit" style={{ padding: "8px 20px", marginRight: "10px" }}>
            생성
          </button>
          <button type="button" onClick={() => setShowCreateTask(false)} style={{ padding: "8px 20px" }}>
            취소
          </button>
        </form>
      )}

      {/* 칸반 보드 */}
      <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
        {/* To Do 칼럼 */}
        <div style={columnStyle}>
          <h3>To Do ({tasks.todo.length})</h3>
          {tasks.todo.map(task => (
            <div key={task._id} style={taskCardStyle}>
              <h4 style={{ marginBottom: "10px" }}>{task.title}</h4>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                {task.description}
              </p>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>
                생성자: {task.createdBy?.name}
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleStatusChange(task._id, "in_progress")}
                  style={{ padding: "5px 10px", fontSize: "12px", flex: 1 }}
                >
                  진행 중 →
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ padding: "5px 10px", fontSize: "12px", backgroundColor: "#dc3545", color: "white", border: "none" }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress 칼럼 */}
        <div style={columnStyle}>
          <h3>In Progress ({tasks.in_progress.length})</h3>
          {tasks.in_progress.map(task => (
            <div key={task._id} style={taskCardStyle}>
              <h4 style={{ marginBottom: "10px" }}>{task.title}</h4>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                {task.description}
              </p>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>
                생성자: {task.createdBy?.name}
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleStatusChange(task._id, "todo")}
                  style={{ padding: "5px 10px", fontSize: "12px", flex: 1 }}
                >
                  ← To Do
                </button>
                <button
                  onClick={() => handleStatusChange(task._id, "done")}
                  style={{ padding: "5px 10px", fontSize: "12px", flex: 1 }}
                >
                  완료 →
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ padding: "5px 10px", fontSize: "12px", backgroundColor: "#dc3545", color: "white", border: "none" }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Done 칼럼 */}
        <div style={columnStyle}>
          <h3>Done ({tasks.done.length})</h3>
          {tasks.done.map(task => (
            <div key={task._id} style={{ ...taskCardStyle, opacity: 0.7 }}>
              <h4 style={{ marginBottom: "10px", textDecoration: "line-through" }}>{task.title}</h4>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                {task.description}
              </p>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>
                생성자: {task.createdBy?.name}
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleStatusChange(task._id, "in_progress")}
                  style={{ padding: "5px 10px", fontSize: "12px", flex: 1 }}
                >
                  ← 진행 중
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ padding: "5px 10px", fontSize: "12px", backgroundColor: "#dc3545", color: "white", border: "none" }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
