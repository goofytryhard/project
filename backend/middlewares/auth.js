// 로그인 확인 미들웨어
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  next();
};

// 프로젝트 멤버 확인 미들웨어
export const requireProjectMember = async (req, res, next) => {
  try {
    const { Project } = await import('../models/Project.js');
    const projectId = req.params.projectId || req.body.projectId;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }

    const isMember = project.members.some(
      member => member.user.toString() === req.session.userId
    );

    if (!isMember) {
      return res.status(403).json({ error: '프로젝트 접근 권한이 없습니다.' });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 프로젝트 관리자 확인 미들웨어
export const requireProjectAdmin = async (req, res, next) => {
  try {
    const project = req.project;
    
    const member = project.members.find(
      m => m.user.toString() === req.session.userId
    );

    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

