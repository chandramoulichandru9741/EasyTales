import React, { useState } from 'react';

const StoryGenerator = () => {
  const [genre, setGenre] = useState('');
  const [characters, setCharacters] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStory('');
    setError('');

    const prompt = `Write a ${genre} story with the following details: Characters - ${characters}, Details - ${specificDetails}`;

    try {
      const response = await fetch('https://api.ai21.com/studio/v1/j2-mid/complete', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer O7KvgPFG5ZK1fCfewPKzRR7GffnqAXdc', // Replace with your API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          numResults: 1,
          maxTokens: 300,
          temperature: 0.7,
          topKReturn: 0,
          topP: 1,
          countPenalty: {
            scale: 0,
            applyToNumbers: false,
            applyToPunctuations: false,
            applyToStopwords: false,
            applyToWhitespaces: false,
            applyToEmojis: false
          },
          frequencyPenalty: {
            scale: 0,
            applyToNumbers: false,
            applyToPunctuations: false,
            applyToStopwords: false,
            applyToWhitespaces: false,
            applyToEmojis: false
          },
          presencePenalty: {
            scale: 0,
            applyToNumbers: false,
            applyToPunctuations: false,
            applyToStopwords: false,
            applyToWhitespaces: false,
            applyToEmojis: false
          },
          stopSequences: ["##"]
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStory(data.completions[0].data.text); // Adjust this path based on actual API response structure

    } catch (error) {
      console.error('Error generating story:', error);
      setError('Error generating story. Please try again.');
    } finally {
      setLoading(false);
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

            {/* Add more genres as needed */}
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
    </div>
  );
};

export default StoryGenerator;
