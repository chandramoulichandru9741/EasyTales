import React, { useState } from 'react';
import axios from 'axios';
import './StoryList.css'; // Ensure this CSS file is present

const StoryList = ({ stories, onLike, onComment, likedStories }) => {
  const [comments, setComments] = useState({}); // To hold comments for each story
  const [showComments, setShowComments] = useState({}); // To track which story's comments are visible

  const fetchComments = async (storyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/stories/${storyId}/comments`);
      setComments(prev => ({ ...prev, [storyId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = (storyId) => {
    setShowComments(prev => ({ ...prev, [storyId]: !prev[storyId] }));
    if (!showComments[storyId]) {
      fetchComments(storyId);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Public Stories:</h2>
      <div className="row">
        {stories.map((story) => (
          <div key={story.id} className="col-md-6 mb-4">
            <div className="card story-card">
              <div className="card-body">
                <h3 className="card-title">{story.genre}</h3>
                <p className="card-text">{story.story}</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => onLike(story.id)}
                  disabled={likedStories.has(story.id)}
                >
                  <i className={`fas fa-thumbs-up ${likedStories.has(story.id) ? 'liked' : ''}`}></i>
                </button>
                <span>{story.likes}</span>
                <button
                  className="btn btn-secondary d-block mt-2"
                  onClick={() => toggleComments(story.id)}
                >
                  <i className="fas fa-comments"></i>
                </button>
                {showComments[story.id] && comments[story.id] && (
                  <div className="comments mt-2">
                    <h4>Comments:</h4>
                    {comments[story.id].map((comment) => (
                      <div key={comment.id}>
                        <p><strong>{comment.username}:</strong> {comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                <form
                  className="mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.target.elements.comment.value;
                    onComment(story.id, comment);
                    e.target.reset(); // Clear the input after submission
                  }}
                >
                  <input type="text" name="comment" className="form-control" placeholder="Add a comment" required />
                  <button type="submit" className="btn btn-success mt-2">Comment</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryList;
