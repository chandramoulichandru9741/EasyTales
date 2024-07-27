import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryForm from './StoryForm';
import StoryList from './StoryList';
import GeneratedStory from './GeneratedStory';
import InfiniteScroll from 'react-infinite-scroller'; // Import the InfiniteScroll component

const StoryGenerator = () => {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicStories, setPublicStories] = useState([]);
  const [likedStories, setLikedStories] = useState(new Set());
  const [genre, setGenre] = useState('');
  const [hasMoreStories, setHasMoreStories] = useState(true); // State to track if there are more stories to fetch
  const [isFetching, setIsFetching] = useState(false); // Flag to prevent multiple simultaneous fetches

  useEffect(() => {
    fetchPublicStories();

    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Only run on component mount

  const fetchPublicStories = async (page = 1, selectedGenre = genre) => {
    if (isFetching) return; // Prevent multiple simultaneous fetches
    setIsFetching(true); // Set fetching flag

    let url = `http://localhost:5000/stories?page=${page}`;
    if (selectedGenre) {
      url += `&genre=${selectedGenre}`;
    }

    try {
      const response = await axios.get(url);
      const stories = response.data;

      setPublicStories((prevStories) => [...prevStories, ...stories]); // Append new stories to existing ones
      setHasMoreStories(stories.length === 10); // Check if there are more stories based on page size (assuming 10 per page)
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Error fetching stories. Please try again.');
    } finally {
      setIsFetching(false); // Reset fetching flag
    }
  };

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    setGenre(selectedGenre);
    setHasMoreStories(true); // Reset hasMore flag
    setPublicStories([]); // Clear the current stories
    fetchPublicStories(1, selectedGenre); // Fetch stories for the new genre
  };

  const handleSubmit = async ({ genre, characters, specificDetails }) => {
    setLoading(true);
    setStory('');
    setError('');

    const prompt = `Write a ${genre} story with the following details: Characters - ${characters}, Details - ${specificDetails}`;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to generate a story.');
      setLoading(false);
      return;
    }

    try {
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
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.completions && response.data.completions[0] && response.data.completions[0].data) {
        const generatedStory = response.data.completions[0].data.text;
        setStory(generatedStory);

        await axios.post('http://localhost:5000/stories', {
          genre,
          characters,
          specificDetails,
          story: generatedStory
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Fetch updated stories after posting new one
        fetchPublicStories(1, genre);
      } else {
        throw new Error('Invalid response from AI21 API');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setError('Error generating story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    if (likedStories.has(storyId)) {
      setError('You have already liked this story.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to like a story.');
        return;
      }

      if (!storyId) {
        setError('Story ID is not available.');
        return;
      }

      await axios.post(`http://localhost:5000/stories/${storyId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setLikedStories((prev) => new Set(prev).add(storyId));
    } catch (error) {
      console.error('Error liking story:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('Error liking story. Please try again.');
      }
    }
  };

  const handleComment = async (storyId, comment) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to comment on a story.');
        return;
      }

      if (!storyId) {
        setError('Story ID is not available.');
        return;
      }

      await axios.post(`http://localhost:5000/stories/${storyId}/comment`, { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error commenting on story:', error);
      setError('Error commenting on story. Please try again.');
    }
  };

  const loader = <div className="loader">Loading...</div>; // Create a loader component for visual feedback

  return (
    <div>
      <StoryForm onSubmit={handleSubmit} loading={loading} />
      {story && <GeneratedStory story={story} />}
      {error && (
        <div style={{ color: 'red' }}>
          <h2>{error}</h2>
        </div>
      )}
      <div className="container mt-4">
        <div className="form-group">
          <label htmlFor="genreSelect">Genre:</label>
          <select id="genreSelect" className="form-control" value={genre} onChange={handleGenreChange}>
            <option value="">All</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="History">History</option>
          </select>
        </div>
      </div>
      <InfiniteScroll
        pageStart={1}
        loadMore={() => fetchPublicStories(publicStories.length / 10 + 1)} // Calculate next page based on current stories length
        hasMore={hasMoreStories}
        loader={loader} // Use the loader component for visual feedback
      >
        <StoryList stories={publicStories} onLike={handleLike} onComment={handleComment} likedStories={likedStories} />
      </InfiniteScroll>
    </div>
  );
};

export default StoryGenerator;
