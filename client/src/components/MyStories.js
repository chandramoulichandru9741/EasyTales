import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <div>
            <h1>My Stories</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {stories.map((story) => (
                    <li key={story.id}>
                        <h3>{story.genre}</h3>
                        <p>{story.story}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyStories;
