// API 기본 URL
const API_URL = 'http://localhost:8080/api';

// Axios 인스턴스 설정
const api = {
  // 인증
  signup: async (data) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  login: async (data) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    });
    return response.json();
  },

  searchUsers: async (query) => {
    const response = await fetch(`${API_URL}/auth/search?query=${query}`, {
      credentials: 'include'
    });
    return response.json();
  },

  // 프로젝트
  createProject: async (data) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  getProjects: async () => {
    const response = await fetch(`${API_URL}/projects`, {
      credentials: 'include'
    });
    return response.json();
  },

  getProject: async (projectId) => {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      credentials: 'include'
    });
    return response.json();
  },

  inviteMember: async (projectId, userId) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      credentials: 'include'
    });
    return response.json();
  },

  // 태스크
  createTask: async (data) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  getTasks: async (projectId) => {
    const response = await fetch(`${API_URL}/tasks/project/${projectId}`, {
      credentials: 'include'
    });
    return response.json();
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    return response.json();
  },

  updateTask: async (taskId, data) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  deleteTask: async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // 활동
  trackActivity: async (data) => {
    const response = await fetch(`${API_URL}/activities/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },

  getActivities: async (projectId) => {
    const response = await fetch(`${API_URL}/activities/project/${projectId}`, {
      credentials: 'include'
    });
    return response.json();
  },

  // 대시보드
  getDashboard: async (projectId) => {
    const response = await fetch(`${API_URL}/dashboard/project/${projectId}`, {
      credentials: 'include'
    });
    return response.json();
  },

  getUserStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/user/stats`, {
      credentials: 'include'
    });
    return response.json();
  }
};

export default api;

