const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller.js');
const protected = require('../middlewares/auth.middleware.js');

// Routes for tasks
router.get('/', protected, taskController.getAllTasks);
router.get('/:id', protected, taskController.getTask);
router.post('/', protected, taskController.createTask);
router.put('/:id', protected, taskController.updateTask);
router.delete('/:id', protected, taskController.deleteTask);

module.exports = router;
