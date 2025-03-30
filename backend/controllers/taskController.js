const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
 
const getTasks = asyncHandler(async (req, res) => {
  const { completed, priority, category, sort } = req.query;
   
  const query = { user: req.user._id };
   
  if (completed) query.completed = completed === 'true';
  if (priority) query.priority = priority;
  if (category) query.category = category;
 
  let sortOption = { createdAt: -1 }; 
  if (sort === 'dueDate') sortOption = { dueDate: 1 };
  if (sort === 'priority') sortOption = { priority: -1 };

  const tasks = await Task.find(query).sort(sortOption);
  res.json(tasks);
});

 
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
 
  if (!title || !title.trim()) {
    res.status(400);
    throw new Error('Title is required');
  }

  const task = await Task.create({
    title: title.trim(),
    description: description ? description.trim() : undefined,
    user: req.user._id,
  });

  res.status(201).json(task);
});  
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});
 
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
 
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
  task.priority = req.body.priority || task.priority;
  task.category = req.body.category !== undefined ? req.body.category : task.category;
  task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
  task.updatedAt = Date.now();

  const updatedTask = await task.save();
  res.json(updatedTask);
});

  
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
 
  await Task.deleteOne({ _id: req.params.id });
  
  res.json({ message: 'Task removed' });
});
 
const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.completed = !task.completed;
  task.updatedAt = Date.now();

  const updatedTask = await task.save();
  res.json(updatedTask);
});
module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};