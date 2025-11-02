import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

// 라우터 임포트
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import activityRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB 연결 URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collab-tracker';

// 미들웨어
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'collab-tracker-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '🚀 협업 기여도 추적 API 서버' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// MongoDB 연결 후 서버 시작
const startServer = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
    console.log(`📦 데이터베이스: ${MONGODB_URI.split('/').pop().split('?')[0]}`);
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`🌐 API 주소: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err.message);
    console.error('💡 .env 파일의 MONGODB_URI를 확인해주세요.');
    process.exit(1);
  }
};

// 서버 시작
startServer();

