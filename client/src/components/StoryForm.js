import React, { useState } from 'react';
import './StoryForm.css'; // Ensure this CSS file is present

const StoryForm = ({ onSubmit, loading }) => {
  const [genre, setGenre] = useState('');
  const [characters, setCharacters] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ genre, characters, specificDetails });
  };

  return (
    <div className="container">
      <div className="story-form-wrapper">
        <h2 className="text-center mb-4">Story Generator</h2>
        <form className="story-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select
              id="genre"
              className="form-control"
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
          <div className="form-group">
            <label htmlFor="characters">Characters:</label>
            <input
              id="characters"
              type="text"
              className="form-control"
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="Enter characters"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specificDetails">Specific Details:</label>
            <input
              id="specificDetails"
              type="text"
              className="form-control"
              value={specificDetails}
              onChange={(e) => setSpecificDetails(e.target.value)}
              placeholder="Enter specific details"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Story'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;
