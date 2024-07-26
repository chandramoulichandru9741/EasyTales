const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userId = await createUser(username, email, password);
    res.json({ message: 'User registered successfully', userId });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed. Try again.', details: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Login failed. Try again.', details: err.message });
  }
});

module.exports = router;
