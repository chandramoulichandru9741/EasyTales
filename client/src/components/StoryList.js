import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Public Stories:</h2>
      {stories.map((story) => (
        <div key={story.id} style={{ marginBottom: '20px' }}>
          <h3>{story.genre}</h3>
          <p>{story.story}</p>
          <button
            onClick={() => onLike(story.id)}
            disabled={likedStories.has(story.id)}
          >
            {likedStories.has(story.id) ? 'Liked' : 'Like'}
            
          </button>
          <p>Likes: {story.likes}</p>
          <button onClick={() => toggleComments(story.id)}>
            {showComments[story.id] ? 'Hide Comments' : 'View Comments'}
          </button>
          {showComments[story.id] && comments[story.id] && (
            <div>
              <h4>Comments:</h4>
              {comments[story.id].map((comment) => (
                <div key={comment.id}>
                  <p><strong>{comment.username}:</strong> {comment.comment}</p>
                </div>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const comment = e.target.elements.comment.value;
              onComment(story.id, comment);
              e.target.reset(); // Clear the input after submission
            }}
          >
            <input type="text" name="comment" placeholder="Add a comment" required />
            <button type="submit">Comment</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
