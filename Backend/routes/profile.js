const express = require('express');
const router = express.Router();

// Mock User Model (Replace this with your actual Database model)
// const User = require('../models/User'); 

// @route   GET /api/profile/:id
// @desc    Get user profile by ID
// @access  Public (or Private if you add auth middleware)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // --- LOGIC START ---
    
    // Example: Fetching from a database (e.g., MongoDB/Mongoose)
    // const user = await User.findById(userId).select('-password'); // Exclude password
    
    // For this demo, we return dummy data:
    const user = {
      id: userId,
      username: "demo_user",
      email: "user@example.com",
      bio: "Full Stack Developer",
      role: "User"
    };

    if (!user) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // --- LOGIC END ---

    res.status(200).json(user);

  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId errors (specific to MongoDB)
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;