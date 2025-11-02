const mongoose = require('mongoose');

// 스키마 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },   // 제목
  completed: { type: Boolean, default: false }, // 완료 여부
  createdAt: { type: Date, default: Date.now }  // 생성일
});

// 모델 생성
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
