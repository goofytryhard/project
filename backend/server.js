// 환경 변수 로드 (.env)
require('dotenv').config();

// 필요한 모듈 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(cors()); // 프론트엔드 접근 허용
app.use(express.json()); // JSON 요청 파싱

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch(err => console.error("MongoDB 연결 실패:", err));

// ###
// CRUD API 라우트
// ###

// 모든 Todo 조회
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Todo 추가
app.post('/todos', async (req, res) => {
  const todo = new Todo({ title: req.body.title });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Todo 수정
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.title = req.body.title ?? todo.title;
    todo.completed = req.body.completed ?? todo.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Todo 삭제
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.deleteOne();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 테스트용 라우트
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`☠️ 서버 실행 중: http://localhost:${PORT}`);
});

