import express from 'express';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import UserActivity from '../models/UserActivity.js';
import { requireAuth, requireProjectMember } from '../middlewares/auth.js';

const router = express.Router();

// 태스크 생성
router.post('/', requireAuth, async (req, res) => {
  try {
    const { projectId, title, description, assignees } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: '프로젝트 ID와 제목을 입력해주세요.' });
    }

    const task = new Task({
      project: projectId,
      title,
      description,
      assignees: assignees || [],
      createdBy: req.session.userId
    });

    await task.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: projectId,
      task: task._id,
      action: 'task_created',
      description: `태스크 "${title}" 생성`
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'userId name')
      .populate('createdBy', 'userId name');

    res.status(201).json({ task: populatedTask });
  } catch (error) {
    console.error('태스크 생성 오류:', error);
    res.status(500).json({ error: '태스크 생성 중 오류가 발생했습니다.' });
  }
});

// 프로젝트의 태스크 목록
router.get('/project/:projectId', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignees', 'userId name')
      .populate('createdBy', 'userId name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('태스크 목록 조회 오류:', error);
    res.status(500).json({ error: '태스크 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 태스크 상태 변경
router.patch('/:taskId/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: '올바른 상태를 입력해주세요.' });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: '태스크를 찾을 수 없습니다.' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: task.project,
      task: task._id,
      action: 'task_status_changed',
      description: `태스크 상태 변경: ${oldStatus} → ${status}`,
      metadata: { oldStatus, newStatus: status }
    });

    // 태스크가 완료되면 UserActivity 업데이트
    if (status === 'done' && task.assignees.includes(req.session.userId)) {
      await UserActivity.findOneAndUpdate(
        {
          user: req.session.userId,
          project: task.project,
          date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        },
        {
          $inc: { completedTasks: 1 }
        },
        { upsert: true }
      );
    }

    const updatedTask = await Task.findById(task._id)
      .populate('assignees', 'userId name')
      .populate('createdBy', 'userId name');

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('태스크 상태 변경 오류:', error);
    res.status(500).json({ error: '태스크 상태 변경 중 오류가 발생했습니다.' });
  }
});

// 태스크 수정
router.patch('/:taskId', requireAuth, async (req, res) => {
  try {
    const { title, description, assignees } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: '태스크를 찾을 수 없습니다.' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignees) task.assignees = assignees;

    await task.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: task.project,
      task: task._id,
      action: 'task_updated',
      description: `태스크 "${task.title}" 수정`
    });

    const updatedTask = await Task.findById(task._id)
      .populate('assignees', 'userId name')
      .populate('createdBy', 'userId name');

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('태스크 수정 오류:', error);
    res.status(500).json({ error: '태스크 수정 중 오류가 발생했습니다.' });
  }
});

// 태스크 삭제
router.delete('/:taskId', requireAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: '태스크를 찾을 수 없습니다.' });
    }

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: task.project,
      task: task._id,
      action: 'task_deleted',
      description: `태스크 "${task.title}" 삭제`
    });

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: '태스크가 삭제되었습니다.' });
  } catch (error) {
    console.error('태스크 삭제 오류:', error);
    res.status(500).json({ error: '태스크 삭제 중 오류가 발생했습니다.' });
  }
});

export default router;

