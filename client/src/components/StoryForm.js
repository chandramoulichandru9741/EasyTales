import React, { useState } from 'react';

const StoryForm = ({ onSubmit, loading }) => {
  const [genre, setGenre] = useState('');
  const [characters, setCharacters] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ genre, characters, specificDetails });
  };

  return (
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
  );
};

export default StoryForm;
