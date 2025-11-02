// Mock 데이터와 임시 인증을 위한 유틸리티
const MOCK_USERS = [
  {
    _id: "1",
    userId: "sohee",
    password: "sohee123",
    name: "김소희",
    email: "sohee@example.com"
  },
  {
    _id: "2", 
    userId: "eungjun",
    password: "eungjun123",
    name: "김응준",
    email: "eungjun@example.com"
  },
  {
    _id: "3",
    userId: "seojun", 
    password: "seojun123",
    name: "김서준",
    email: "seojun@example.com"
  },
  {
    _id: "4",
    userId: "seungmin",
    password: "seungmin123", 
    name: "백승민",
    email: "seungmin@example.com"
  },
  // 기존 테스트 계정 유지
  {
    _id: "5",
    userId: "asdf",
    password: "asdf!1234",
    name: "테스트",
    email: "test@example.com"
  }
];

const MOCK_USER = MOCK_USERS[0]; // 기본 사용자 (김소희)

const MOCK_PROJECTS = [
  {
    _id: "1",
    name: "웹 개발 프로젝트",
    description: "React와 Node.js를 활용한 협업 플랫폼 개발",
    members: [
      { user: { _id: "1", userId: "sohee", name: "김소희" }, role: "admin" },
      { user: { _id: "2", userId: "eungjun", name: "김응준" }, role: "member" },
      { user: { _id: "3", userId: "seojun", name: "김서준" }, role: "member" },
      { user: { _id: "4", userId: "seungmin", name: "백승민" }, role: "member" }
    ]
  },
  {
    _id: "2", 
    name: "모바일 앱 디자인",
    description: "사용자 경험을 중심으로 한 모바일 앱 UI/UX 디자인",
    members: [
      { user: { _id: "1", userId: "sohee", name: "김소희" }, role: "member" },
      { user: { _id: "2", userId: "eungjun", name: "김응준" }, role: "admin" },
      { user: { _id: "3", userId: "seojun", name: "김서준" }, role: "member" }
    ]
  },
  {
    _id: "3",
    name: "데이터 분석 프로젝트", 
    description: "빅데이터를 활용한 사용자 행동 패턴 분석",
    members: [
      { user: { _id: "4", userId: "seungmin", name: "백승민" }, role: "admin" },
      { user: { _id: "1", userId: "sohee", name: "김소희" }, role: "member" },
      { user: { _id: "3", userId: "seojun", name: "김서준" }, role: "member" }
    ]
  }
];

const MOCK_STATS = {
  projectCount: 3,
  completedTasks: 18,
  inProgressTasks: 7,
  totalTime: 360 // 분
};

// Mock API 함수들
const mockApi = {
  signup: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    
    // 중복 사용자 ID 확인
    const existingUser = MOCK_USERS.find(u => u.userId === data.userId);
    if (existingUser) {
      return { error: "이미 존재하는 사용자 ID입니다." };
    }
    
    return { 
      message: "회원가입이 완료되었습니다.",
      user: { 
        id: "new_user", 
        userId: data.userId, 
        name: data.name 
      }
    };
  },

  login: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    
    // 모든 사용자 계정에서 로그인 확인
    const user = MOCK_USERS.find(u => u.userId === data.userId && u.password === data.password);
    
    if (user) {
      // 로컬 스토리지에 로그인 상태 저장
      localStorage.setItem('mockUser', JSON.stringify(user));
      return { 
        message: "로그인 성공",
        user: user
      };
    }
    
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  },

  logout: async () => {
    localStorage.removeItem('mockUser');
    return { message: "로그아웃 되었습니다." };
  },

  getCurrentUser: async () => {
    const user = localStorage.getItem('mockUser');
    if (user) {
      return { user: JSON.parse(user) };
    }
    return { error: "로그인이 필요합니다." };
  },

  getProjects: async () => {
    return { projects: MOCK_PROJECTS };
  },

  getUserStats: async () => {
    return MOCK_STATS;
  },

  createProject: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      project: {
        _id: Date.now().toString(),
        ...data,
        members: [{ user: MOCK_USER, role: "admin" }]
      }
    };
  }
};

// 실제 API 또는 Mock API 선택
const USE_MOCK = true; // MongoDB 연결 안될 때 true로 설정

const api = USE_MOCK ? mockApi : {
  // 실제 API 함수들 (기존 코드)
  signup: async (data) => {
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return response.json();
  },
  // ... 나머지 실제 API 함수들
};

export default api;
