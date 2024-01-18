const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, 'Task Should be Unique'],
    required: [true, 'Task title is required.'],
    trim: true,
    maxLength: [50, 'Task max length is 50 Chars'],
    minLength: [10, 'Task min length is 10 Chars'],
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: {
      values: ['To Do', 'In Progress', 'Done'],
      messages: 'Set Status as To Do,In Progress or Done', 
    },
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      messages: 'Priority is High, Medium or Low',
    },
    default: 'Medium',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'Task must be assigned to a user.'],
  },
  labels: {
    type: [String],
    default: [],
  },
  subtasks: [subtaskSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
