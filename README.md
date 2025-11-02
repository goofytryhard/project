# 협업 기여도 추적 플랫폼

조별 과제 수행 시, 팀원들의 실제 기여도를 투명하게 추적하고 시각화하여 '무임승차' 문제를 해결하는 협업 툴입니다.

## 주요 기능

### 1. 사용자 관리
- 회원가입 / 로그인 / 로그아웃 (세션 기반)
- 사용자 검색 기능

### 2. 프로젝트 관리
- 프로젝트 생성
- 팀원 초대 (사용자 ID/이메일로 검색)
- 권한 관리 (Admin / Member)

### 3. 태스크 관리 (칸반 보드)
- 태스크 생성 / 수정 / 삭제
- 태스크 상태 변경 (To Do, In Progress, Done)
- 담당자 배정

### 4. 활동 로그 기록
- 사용자 활동 자동 기록
- 타이핑 수 추적
- 접속 시간 추적
- 태스크 완료 기록

### 5. 관리자 대시보드
- 프로젝트 전체 현황 (태스크 진행도)
- 개인별 기여도 통계
  - 완료한 태스크 수
  - 총 접속 시간
  - 총 타이핑 수
  - 활동 로그 수
- 최근 활동 내역

## 기술 스택

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Session**: express-session + connect-mongo

## 프로젝트 구조

```
project-main/
├── frontend/           # React 프론트엔드
│   ├── src/
│   │   ├── pages/     # 페이지 컴포넌트
│   │   ├── api.js     # API 통신 함수
│   │   ├── App.jsx    # 메인 앱
│   │   └── main.jsx   # 엔트리 포인트
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend/           # Node.js 백엔드
    ├── models/        # MongoDB 모델
    ├── routes/        # API 라우트
    ├── middlewares/   # 인증 미들웨어
    ├── server.js      # 서버 엔트리 포인트
    └── package.json
```

## 설치 및 실행 방법

### 1. Backend 설정

```bash
cd backend
npm install
```

`.env` 파일 설정:
```
MONGODB_URI=mongodb://localhost:27017/collab-tracker
SESSION_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

Backend 실행:
```bash
npm run dev    # 개발 모드 (nodemon)
npm start      # 프로덕션 모드
```

### 2. Frontend 설정

```bash
cd frontend
npm install
npm run dev    # 개발 서버 실행 (기본 포트: 3000)
```

### 3. MongoDB 실행

MongoDB가 로컬에서 실행 중이어야 합니다:
```bash
mongod
```

## API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보
- `GET /api/auth/search` - 사용자 검색

### 프로젝트
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects` - 내 프로젝트 목록
- `GET /api/projects/:projectId` - 프로젝트 상세
- `POST /api/projects/:projectId/invite` - 팀원 초대

### 태스크
- `POST /api/tasks` - 태스크 생성
- `GET /api/tasks/project/:projectId` - 프로젝트 태스크 목록
- `PATCH /api/tasks/:taskId/status` - 태스크 상태 변경
- `PATCH /api/tasks/:taskId` - 태스크 수정
- `DELETE /api/tasks/:taskId` - 태스크 삭제

### 활동
- `POST /api/activities/track` - 활동 기록
- `GET /api/activities/project/:projectId` - 프로젝트 활동 로그

### 대시보드
- `GET /api/dashboard/project/:projectId` - 프로젝트 대시보드
- `GET /api/dashboard/user/stats` - 개인 통계

## 데이터베이스 모델

### Users
- userId (String, unique)
- password (String, hashed)
- name (String)
- email (String, optional)

### Projects
- name (String)
- description (String)
- createdBy (User reference)
- members (Array of { user, role })

### Tasks
- project (Project reference)
- title (String)
- description (String)
- status (enum: todo, in_progress, done)
- assignees (Array of User references)
- createdBy (User reference)

### ActivityLog
- user (User reference)
- project (Project reference)
- task (Task reference, optional)
- action (String)
- description (String)
- metadata (Mixed)
- timestamp (Date)

### UserActivity
- user (User reference)
- project (Project reference)
- sessionStart (Date)
- sessionEnd (Date)
- totalTime (Number, in seconds)
- typingCount (Number)
- completedTasks (Number)

## 개발자

조별 과제용 협업 기여도 추적 플랫폼

## 라이선스

MIT
