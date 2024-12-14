const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const { body, validationResult } = require('express-validator');  // Pastikan ini diimpor

const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'address',] // Optional: limit fields returned
    });

    // Return success response with user data
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching users' });
  }
};

// Function to get a user by ID
const getUserSelf = async (req, res) => {
  const userId = req.userId; 
console.log("j")
  try {
    // Fetch user by ID
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'username', 'email', 'address',]
    });

    // If the user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    // Return success response with user data
    res.status(200).json({
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the user' });
  }
};

// Function to update a user's details
const updateUser = async (req, res) => {
  const userId = req.userId; 
  const { username, email, password, address, latitude, longitude } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    // Create an update object with only provided fields
    const updates = {};
    
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (address) updates.address = address;
    if (latitude) updates.latitude = latitude;
    if (longitude) updates.longitude = longitude;
    
    // Handle password separately due to hashing requirement
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // Update only the provided fields
    await user.update(updates);

    // Return success response with updated user data
    res.status(200).json({
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
};


module.exports = {
  getUsers,
  getUserSelf,
  updateUser
};
