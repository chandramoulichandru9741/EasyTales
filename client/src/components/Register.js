import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, email, password });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage('Registration failed. Try again.');
    }
  };

  return (
    <div className="register-form-wrapper">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username:</label>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            {message && <p className="mt-3 text-center text-danger">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
