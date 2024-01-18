const Task = require('../models/task.model.js');
const APIFeatures = require('../utils/apiFeature.js');
const asyncHandler = require('../utils/asyncHandler.js');
const appError = require('../utils/appError.js');

// Controller for handling task operations

const getAllTasks = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(
    Task.find({ createdBy: req.userId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;
  res.json(tasks);
});

const getTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new appError(`Task not found`, 404));
  }
  res.status(200).json(task);
});

const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, dueDate, status, priority, labels, subtasks } =
    req.body;

  const createdBy = req.userId; // Use the logged-in user's ID as createdBy

  const newTask = await Task.create({
    title,
    description,
    dueDate,
    status,
    priority,
    labels,
    subtasks,
    createdBy, // Add createdBy field
  });

  res.status(201).json(newTask);
});

const updateTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
    new: true,
    runValidators: true,
  });

  if (!updatedTask) {
    return next(new appError(`Task not found`, 404));
  }

  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  // Find the task by ID and check its status before deleting
  const taskToDelete = await Task.findById(taskId);

  if (!taskToDelete) {
    return next(new appError(`Task not found`, 404));
  }

  // Perform the deletion if all checks pass
  await Task.findByIdAndDelete(taskId);

  res.status(204).json({ status: 'success' });
});

module.exports = { getAllTasks, getTask, updateTask, createTask, deleteTask };
