const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  return result.insertId;
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const saveStory = async (userId, genre, characters, specificDetails, story) => {
    const [result] = await pool.query('INSERT INTO stories (user_id, genre, characters, specific_details, story) VALUES (?, ?, ?, ?, ?)', [userId, genre, characters, specificDetails, story]);
    return result.insertId;
  };
  
  const getPublicStories = async () => {
    const [rows] = await pool.query('SELECT * FROM stories ORDER BY created_at DESC LIMIT 10');
    return rows;
  };
  
  const likeStory = async (userId, storyId) => {
    await pool.query('INSERT INTO likes (user_id, story_id) VALUES (?, ?)', [userId, storyId]);
  };
  
  const commentStory = async (userId, storyId, comment) => {
    await pool.query('INSERT INTO comments (user_id, story_id, comment) VALUES (?, ?, ?)', [userId, storyId, comment]);
  };
  
  module.exports = {
    createUser,
    findUserByUsername,
    saveStory,
    getPublicStories,
    likeStory,
    commentStory
  };