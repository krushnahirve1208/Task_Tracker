const Task = require('../models/task.model.js');

// Controller for handling task operations

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, dueDate, status, priority, labels, subtasks } =
    req.body;

  const createdBy = req.userId; // Use the logged-in user's ID as createdBy

  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID and check its status before deleting
    const taskToDelete = await Task.findById(taskId);

    if (!taskToDelete) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Perform the deletion if all checks pass
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllTasks, getTask, updateTask, createTask, deleteTask };
