import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { requireAuth, requireProjectMember, requireProjectAdmin } from '../middlewares/auth.js';

const router = express.Router();

// 프로젝트 생성
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: '프로젝트 이름을 입력해주세요.' });
    }

    const project = new Project({
      name,
      description,
      createdBy: req.session.userId,
      members: [{
        user: req.session.userId,
        role: 'admin'
      }]
    });

    await project.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: project._id,
      action: 'project_created',
      description: `프로젝트 "${name}" 생성`
    });

    const populatedProject = await Project.findById(project._id)
      .populate('members.user', 'userId name');

    res.status(201).json({ project: populatedProject });
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    res.status(500).json({ error: '프로젝트 생성 중 오류가 발생했습니다.' });
  }
});

// 내 프로젝트 목록
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.session.userId
    }).populate('members.user', 'userId name');

    res.json({ projects });
  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error);
    res.status(500).json({ error: '프로젝트 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 프로젝트 상세 정보
router.get('/:projectId', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('members.user', 'userId name email');

    res.json({ project });
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ error: '프로젝트 조회 중 오류가 발생했습니다.' });
  }
});

// 팀원 초대
router.post('/:projectId/invite', requireAuth, requireProjectMember, requireProjectAdmin, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '초대할 사용자 ID를 입력해주세요.' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const project = req.project;

    // 이미 멤버인지 확인
    const isMember = project.members.some(
      m => m.user.toString() === user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ error: '이미 프로젝트 멤버입니다.' });
    }

    // 멤버 추가
    project.members.push({
      user: user._id,
      role: 'member'
    });

    await project.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: project._id,
      action: 'member_invited',
      description: `${user.name}님을 프로젝트에 초대`
    });

    const updatedProject = await Project.findById(project._id)
      .populate('members.user', 'userId name email');

    res.json({ project: updatedProject });
  } catch (error) {
    console.error('팀원 초대 오류:', error);
    res.status(500).json({ error: '팀원 초대 중 오류가 발생했습니다.' });
  }
});

// 팀원 제거
router.delete('/:projectId/members/:memberId', requireAuth, requireProjectMember, requireProjectAdmin, async (req, res) => {
  try {
    const project = req.project;
    const { memberId } = req.params;

    project.members = project.members.filter(
      m => m.user.toString() !== memberId
    );

    await project.save();

    // 활동 로그 기록
    await ActivityLog.create({
      user: req.session.userId,
      project: project._id,
      action: 'member_removed',
      description: `팀원 제거`
    });

    res.json({ message: '팀원이 제거되었습니다.' });
  } catch (error) {
    console.error('팀원 제거 오류:', error);
    res.status(500).json({ error: '팀원 제거 중 오류가 발생했습니다.' });
  }
});

export default router;

