const express = require('express');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername, saveStory, getStories, likeStory, commentStory, getPublicStories } = require('../models/User');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const userId = await createUser(username, password);
    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.post('/stories', authenticateToken, async (req, res) => {
    const { genre, characters, specificDetails, story } = req.body;
    const userId = req.user.userId;
  
    try {
      const storyId = await saveStory(userId, genre, characters, specificDetails, story);
      res.status(201).json({ message: 'Story saved', storyId });
    } catch (error) {
      res.status(500).json({ message: 'Error saving story', error });
    }
  });
  
  // Route to fetch public stories
  router.get('/stories', async (req, res) => {
    try {
      const stories = await getPublicStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stories', error });
    }
  });
  
  // Route to like a story
  router.post('/stories/:id/like', authenticateToken, async (req, res) => {
    const storyId = req.params.id;
    const userId = req.user.userId;
  
    try {
      await likeStory(userId, storyId);
      res.status(201).json({ message: 'Story liked' });
    } catch (error) {
      res.status(500).json({ message: 'Error liking story', error });
    }
  });
  
  // Route to comment on a story
  router.post('/stories/:id/comment', authenticateToken, async (req, res) => {
    const storyId = req.params.id;
    const userId = req.user.userId;
    const { comment } = req.body;
  
    try {
      await commentStory(userId, storyId, comment);
      res.status(201).json({ message: 'Comment added' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  });
  
  module.exports = router;