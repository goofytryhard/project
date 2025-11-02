import express from 'express';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import UserActivity from '../models/UserActivity.js';
import Project from '../models/Project.js';
import { requireAuth, requireProjectMember } from '../middlewares/auth.js';

const router = express.Router();

// 프로젝트 대시보드 통계
router.get('/project/:projectId', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // 프로젝트 정보
    const project = await Project.findById(projectId)
      .populate('members.user', 'userId name');

    // 태스크 통계
    const tasks = await Task.find({ project: projectId });
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length
    };

    // 개인별 기여도 통계
    const memberStats = [];
    
    for (const member of project.members) {
      const userId = member.user._id;

      // 완료한 태스크 수
      const completedTasks = await Task.countDocuments({
        project: projectId,
        assignees: userId,
        status: 'done'
      });

      // 총 활동 시간 및 타이핑 수
      const activities = await UserActivity.find({
        user: userId,
        project: projectId
      });

      const totalTime = activities.reduce((sum, a) => sum + (a.totalTime || 0), 0);
      const totalTyping = activities.reduce((sum, a) => sum + (a.typingCount || 0), 0);

      // 활동 로그 수
      const activityCount = await ActivityLog.countDocuments({
        user: userId,
        project: projectId
      });

      memberStats.push({
        user: {
          id: member.user._id,
          userId: member.user.userId,
          name: member.user.name
        },
        role: member.role,
        completedTasks,
        totalTime: Math.floor(totalTime / 60), // 분 단위
        totalTyping,
        activityCount
      });
    }

    // 최근 활동
    const recentActivities = await ActivityLog.find({ project: projectId })
      .populate('user', 'userId name')
      .populate('task', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    // 진행도 데이터 (번다운 차트용)
    const progressData = [];
    const startDate = new Date(project.createdAt);
    const today = new Date();
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const completedCount = await Task.countDocuments({
        project: projectId,
        status: 'done',
        updatedAt: { $lte: date }
      });
      
      progressData.push({
        date: date.toISOString().split('T')[0],
        completed: completedCount,
        total: taskStats.total
      });
    }

    res.json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description
      },
      taskStats,
      memberStats,
      recentActivities,
      progressData
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({ error: '대시보드 통계 조회 중 오류가 발생했습니다.' });
  }
});

// 개인 통계
router.get('/user/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // 참여 중인 프로젝트 수
    const projectCount = await Project.countDocuments({
      'members.user': userId
    });

    // 완료한 태스크 수
    const completedTasks = await Task.countDocuments({
      assignees: userId,
      status: 'done'
    });

    // 진행 중인 태스크 수
    const inProgressTasks = await Task.countDocuments({
      assignees: userId,
      status: 'in_progress'
    });

    // 총 활동 시간
    const activities = await UserActivity.find({ user: userId });
    const totalTime = activities.reduce((sum, a) => sum + (a.totalTime || 0), 0);

    res.json({
      projectCount,
      completedTasks,
      inProgressTasks,
      totalTime: Math.floor(totalTime / 60) // 분 단위
    });
  } catch (error) {
    console.error('개인 통계 조회 오류:', error);
    res.status(500).json({ error: '개인 통계 조회 중 오류가 발생했습니다.' });
  }
});

export default router;

