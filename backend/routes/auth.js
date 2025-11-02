import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { userId, password, name, email } = req.body;

    // 필수 필드 확인
    if (!userId || !password || !name) {
      return res.status(400).json({ error: '모든 필수 항목을 입력해주세요.' });
    }

    // 중복 사용자 확인
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자 ID입니다.' });
    }

    // 사용자 생성
    const user = new User({ userId, password, name, email });
    await user.save();

    res.status(201).json({ 
      message: '회원가입이 완료되었습니다.',
      user: { 
        id: user._id, 
        userId: user.userId, 
        name: user.name 
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // 필수 필드 확인
    if (!userId || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }

    // 사용자 찾기
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 세션에 사용자 정보 저장
    req.session.userId = user._id.toString();
    req.session.userName = user.name;

    res.json({ 
      message: '로그인 성공',
      user: { 
        id: user._id, 
        userId: user.userId, 
        name: user.name 
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.json({ message: '로그아웃 되었습니다.' });
  });
});

// 현재 사용자 정보
router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ user });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ error: '사용자 정보 조회 중 오류가 발생했습니다.' });
  }
});

// 사용자 검색 (프로젝트 초대용)
router.get('/search', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: '검색어를 입력해주세요.' });
    }

    const users = await User.find({
      $or: [
        { userId: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('userId name email').limit(10);

    res.json({ users });
  } catch (error) {
    console.error('사용자 검색 오류:', error);
    res.status(500).json({ error: '사용자 검색 중 오류가 발생했습니다.' });
  }
});

export default router;

