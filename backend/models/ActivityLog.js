import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
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
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  action: {
    type: String,
    required: true,
    // 예: 'task_created', 'task_updated', 'task_completed', 'comment_added', 'typing'
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 추가 (검색 성능 향상)
activityLogSchema.index({ user: 1, project: 1 });
activityLogSchema.index({ timestamp: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);

