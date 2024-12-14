const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const { body, validationResult } = require('express-validator');  // Pastikan ini diimpor



const login = async (req, res) => {
  // Validate email format and password length using express-validator
  await body('username').notEmpty().withMessage('Username is required').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').run(req);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, send a 400 status with the errors
    return res.status(400).json({  message:'failed validation', errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Find user by email in the database
    const user = await User.findOne({ where: { username } });

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If password is incorrect, return a 401 error
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token with user information
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
    
    );

    // Return success response with the generated token
    res.status(200).json({
      
      message: 'Successfully logged in',
      data: { token, user }
    });
  } catch (error) {
    // If an error occurs during the process, log it and return a 500 error
    console.error(error);
    res.status(500).json({   message: 'An error occurred during login' });
  }
};

const register = async (req, res) => {
  // Validate input fields: email, password, name, and role
  await body('email').isEmail().withMessage('Email is not valid').run(req);
  await body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters').run(req);
  await body('username').notEmpty().withMessage('Username is required').run(req);
 
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, send a 400 status with the errors
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username,} = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If email already exists, return a 400 error
      return res.status(400).json({  message: 'Email is already registered' });
    }

    // validastion password
    if (typeof password !== 'string') {
      return res.status(400).json({   message: 'Password must be a string' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Create a JWT token for the new user
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        username: newUser.username, 
      },
      process.env.ACCESS_TOKEN_SECRET,
    );

    // Return success response with the generated token
    res.status(201).json({
      
      message: 'User successfully created',
      data: {
        token: token, user:newUser,
      }
    });
  } catch (error) {
    // If an error occurs during the registration process, log it and return a 500 error
    console.error(error);
    res.status(500).json({   message: 'An error occurred during registration' });
  }
};


module.exports = {
  login,
 register
};
