import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StoryGenerator from './components/StoryGenerator';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<StoryGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
