const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const protected = require('../middlewares/auth.middleware.js');

// Routes for users
router.get('/', protected, userController.getAllUsers);
router.get('/:id', protected, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', protected, userController.updateUser);
router.delete('/:id', protected, userController.deleteUser);
router.post('/login', userController.loginUser);

module.exports = router;
