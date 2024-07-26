const pool = require('../config/db');

const saveStory = async (userId, genre, characters, specificDetails, story) => {
  const [result] = await pool.query('INSERT INTO stories (user_id, genre, characters, specific_details, story) VALUES (?, ?, ?, ?, ?)', [userId, genre, characters, specificDetails, story]);
  return result.insertId;
};

const getPublicStories = async (genre = '') => {
  let query = `
    SELECT stories.*, COUNT(likes.id) as likes
    FROM stories
    LEFT JOIN likes ON stories.id = likes.story_id
  `;
  const params = [];

  if (genre) {
    query += ` WHERE genre = ?`;
    params.push(genre);
  }

  query += `
    GROUP BY stories.id
    ORDER BY likes DESC, stories.created_at DESC
    LIMIT 10
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

const likeStory = async (userId, storyId) => {
  const [existingLike] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND story_id = ?', [userId, storyId]);
  if (existingLike.length > 0) {
    throw new Error('You have already liked this story');
  }
  await pool.query('INSERT INTO likes (user_id, story_id) VALUES (?, ?)', [userId, storyId]);
};

const commentStory = async (userId, storyId, comment) => {
  await pool.query('INSERT INTO comments (user_id, story_id, comment) VALUES (?, ?, ?)', [userId, storyId, comment]);
};

const getStoryComments = async (storyId) => {
  const [rows] = await pool.query(`
    SELECT comments.*, users.username 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.story_id = ?
    ORDER BY comments.created_at ASC
  `, [storyId]);
  return rows;
};

const getUserStories = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM stories WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
};

module.exports = {
  saveStory,
  getPublicStories,
  likeStory,
  commentStory,
  getStoryComments,
  getUserStories
};
