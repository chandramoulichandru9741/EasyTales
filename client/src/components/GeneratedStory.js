import React from 'react';

const GeneratedStory = ({ story }) => {
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2 className="text-center mb-4">Generated Story</h2>
        <p>{story}</p>
      </div>
    </div>
  );
};

export default GeneratedStory;
