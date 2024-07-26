const express = require('express');
const router = express.Router();
const { saveStory, getPublicStories, likeStory, commentStory, getStoryComments, getUserStories } = require('../models/story');
const authenticateToken = require('../middleware/auth');
const pool = require('../config/db');

router.post('/', authenticateToken, async (req, res) => {
  const { genre, characters, specificDetails, story } = req.body;

  try {
    const storyId = await saveStory(req.user._id, genre, characters, specificDetails, story);
    res.json({ storyId });
  } catch (err) {
    res.status(400).json({ error: 'Error saving story. Try again.', details: err.message });
  }
});

router.get('/', async (req, res) => {
  const { genre } = req.query;

  try {
    const stories = await getPublicStories(genre);
    res.json(stories);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching stories. Try again.', details: err.message });
  }
});

router.post('/:storyId/like', authenticateToken, async (req, res) => {
  try {
    await likeStory(req.user._id, req.params.storyId);
    res.json({ message: 'Story liked' });
  } catch (err) {
    res.status(400).json({ error: 'You have already liked this story.', details: err.message });
  }
});

router.post('/:storyId/comment', authenticateToken, async (req, res) => {
  const { comment } = req.body;

  try {
    await commentStory(req.user._id, req.params.storyId, comment);
    res.json({ message: 'Comment added' });
  } catch (err) {
    res.status(400).json({ error: 'Error commenting on story. Try again.', details: err.message });
  }
});

router.get('/:storyId/comments', async (req, res) => {
  try {
    const comments = await getStoryComments(req.params.storyId);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching comments. Try again.', details: err.message });
  }
});

router.get('/user/stories', authenticateToken, async (req, res) => {
  try {
    const stories = await getUserStories(req.user._id);
    res.json(stories);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching user stories. Try again.', details: err.message });
  }
});

module.exports = router;
