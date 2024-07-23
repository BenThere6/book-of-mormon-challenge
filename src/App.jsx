import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import UsernameEntry from './components/Username';
import Feedback from './components/Feedback'; // Import the Feedback component
import Admin from './components/Admin'; // Import the Admin component
import './assets/css/style.css';

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [category, setCategory] = useState('all-verses'); // Default to 'all-verses'
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState(''); // State for username
  const navigate = useNavigate();
  let usedVerses = [];

  const startGame = (gameID, selectedDifficulty, selectedCategory) => {
    setDifficulty(selectedDifficulty);
    setCategory(selectedCategory);
    navigate('/game', { state: { difficulty: selectedDifficulty, category: selectedCategory, gameID } });
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    navigate('/leaderboard', { state: { score: finalScore, difficulty, category, username } });
  };

  const handleStartScreen = () => {
    navigate('/');
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<StartScreen startGame={startGame} />} />
        <Route path="/game" element={<Game difficulty={difficulty} category={category} endGame={endGame} usedVerses={usedVerses} username={username} />} />
        <Route path="/leaderboard" element={<Leaderboard score={score} difficulty={difficulty} category={category} onStartScreen={handleStartScreen} />} />
        <Route path="/username" element={<UsernameEntry startGame={startGame} setUsername={setUsername} />} />
        <Route path="/feedback" element={<Feedback username={username} />} />
        <Route path="/admin" element={<Admin />} /> {/* Add the Admin route */}
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}