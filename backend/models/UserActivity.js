import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // 접속 시간 추적
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: {
    type: Date
  },
  totalTime: {
    type: Number, // 초 단위
    default: 0
  },
  // 타이핑 추적
  typingCount: {
    type: Number,
    default: 0
  },
  // 완료한 태스크 수
  completedTasks: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// 복합 인덱스
userActivitySchema.index({ user: 1, project: 1, date: 1 });

export default mongoose.model('UserActivity', userActivitySchema);

