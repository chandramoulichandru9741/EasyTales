import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyStories.css'; // Ensure this CSS file is imported

const MyStories = () => {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        const fetchUserStories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stories/user/stories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching user stories:', error);
                setError('Error fetching stories. Please try again.');
            }
        };

        fetchUserStories();
    }, [token, navigate]);

    return (
        <div className="background-image">
            <div className="container py-4">
                <h1 className="text-center mb-4">My Stories</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <ul className="list-group">
                    {stories.map((story) => (
                        <li key={story.id} className="list-group-item mb-3 story-item">
                            <h3>{story.genre}</h3>
                            <p>{story.story}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyStories;
