const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler.js');
const appError = require('../utils/appError.js');

// Controller for handling user operations

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

// Get a specific user by ID
const getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new appError(`User not found`, 404));
  }
  res.json(user);
});

const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Create a new user
  const user = new User({ username, email, password });
  await user.save();

  res.status(201).json({ message: 'User registered successfully', user });
});

// Update an existing user
const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
    new: true,
  });

  if (!updatedUser) {
    return next(new appError(`User not found`, 404));
  }

  res.json(updatedUser);
});

// Delete a user by ID
const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return next(new appError(`User not found`, 404));
  }

  res.status(204).json({ status: 'success' });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new appError(`User not found`, 404));
  }

  // Compare the provided password with the hashed password stored in the database
  const passwordMatch = await user.correctPassword(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Password is correct; generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  // Respond with the token and user information
  res.cookie('jwt', token, { httpOnly: true });
  res.json({
    user: { _id: user._id, username: user.username, email: user.email },
  });
});

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
