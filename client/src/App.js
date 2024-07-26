import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StoryGenerator from './components/StoryGenerator';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import MyStories from './components/MyStories';
function App() {
  return (
    <Router>
      <div>
        < Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<StoryGenerator />} />
          <Route path="/stories" element={<MyStories />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
