import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoryGenerator = () => {
  const [genre, setGenre] = useState('');
  const [characters, setCharacters] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicStories, setPublicStories] = useState([]);

  useEffect(() => {
    const fetchPublicStories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/stories');
        setPublicStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchPublicStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStory('');
    setError('');

    const prompt = `Write a ${genre} story with the following details: Characters - ${characters}, Details - ${specificDetails}`;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://api.ai21.com/studio/v1/j2-mid/complete',
        {
          prompt: prompt,
          numResults: 1,
          maxTokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': 'Bearer O7KvgPFG5ZK1fCfewPKzRR7GffnqAXdc', // Replace with your API key
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      setStory(response.data.completions[0].data.text); // Adjust this path based on actual API response structure

      // Save the story to the database
      await axios.post('http://localhost:5000/auth/stories', {
        genre,
        characters,
        specificDetails,
        story: response.data.completions[0].data.text
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    } catch (error) {
      console.error('Error generating story:', error);
      setError('Error generating story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/auth/stories/${storyId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const handleComment = async (storyId, comment) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/auth/stories/${storyId}/comment`, { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error commenting on story:', error);
    }
  };

  return (
    <div>
      <h1>Story Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Genre:</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="">Select a genre</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="History">History</option>
          </select>
        </div>
        <div>
          <label>Characters:</label>
          <input
            type="text"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            placeholder="Enter characters"
            required
          />
        </div>
        <div>
          <label>Specific Details:</label>
          <input
            type="text"
            value={specificDetails}
            onChange={(e) => setSpecificDetails(e.target.value)}
            placeholder="Enter specific details"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Story'}
        </button>
      </form>

      {story && (
        <div>
          <h2>Generated Story:</h2>
          <p>{story}</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <h2>{error}</h2>
        </div>
      )}

      <h2>Public Stories:</h2>
      {publicStories.map((story) => (
        <div key={story.id}>
          <h3>{story.genre}</h3>
          <p>{story.story}</p>
          <button onClick={() => handleLike(story.id)}>Like</button>
          <form onSubmit={(e) => {
            e.preventDefault();
            const comment = e.target.elements.comment.value;
            handleComment(story.id, comment);
          }}>
            <input type="text" name="comment" placeholder="Add a comment" required />
            <button type="submit">Comment</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default StoryGenerator;
