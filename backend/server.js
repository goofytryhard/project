require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/Todo'); // Todo 모델 가져오기

const app = express();
app.use(express.json()); // JSON 요청 처리

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch(err => console.error("MongoDB 연결 실패", err));

// ----------------------------
// CRUD API 라우트
// ----------------------------

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

// 특정 Todo 수정
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

// 특정 Todo 삭제
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.remove();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 테스트 라우트
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`☠️ 서버 실행 중: http://localhost:${PORT}`);
});

