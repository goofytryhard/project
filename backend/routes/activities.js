import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import UserActivity from '../models/UserActivity.js';
import { requireAuth, requireProjectMember } from '../middlewares/auth.js';

const router = express.Router();

// 활동 기록 (타이핑, 접속 등)
router.post('/track', requireAuth, async (req, res) => {
  try {
    const { projectId, action, metadata } = req.body;

    if (!projectId || !action) {
      return res.status(400).json({ error: '프로젝트 ID와 액션을 입력해주세요.' });
    }

    // 타이핑 이벤트 처리
    if (action === 'typing') {
      await UserActivity.findOneAndUpdate(
        {
          user: req.session.userId,
          project: projectId,
          date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        },
        {
          $inc: { typingCount: metadata?.count || 1 }
        },
        { upsert: true }
      );
    }

    // 세션 시간 추적
    if (action === 'session_start') {
      await UserActivity.create({
        user: req.session.userId,
        project: projectId,
        sessionStart: new Date(),
        date: new Date()
      });
    }

    if (action === 'session_end') {
      const session = await UserActivity.findOne({
        user: req.session.userId,
        project: projectId,
        sessionEnd: { $exists: false }
      }).sort({ sessionStart: -1 });

      if (session) {
        const sessionTime = Math.floor((new Date() - session.sessionStart) / 1000);
        session.sessionEnd = new Date();
        session.totalTime = sessionTime;
        await session.save();
      }
    }

    res.json({ message: '활동이 기록되었습니다.' });
  } catch (error) {
    console.error('활동 기록 오류:', error);
    res.status(500).json({ error: '활동 기록 중 오류가 발생했습니다.' });
  }
});

// 프로젝트 활동 로그 조회
router.get('/project/:projectId', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const logs = await ActivityLog.find({ project: req.params.projectId })
      .populate('user', 'userId name')
      .populate('task', 'title')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ logs });
  } catch (error) {
    console.error('활동 로그 조회 오류:', error);
    res.status(500).json({ error: '활동 로그 조회 중 오류가 발생했습니다.' });
  }
});

export default router;

