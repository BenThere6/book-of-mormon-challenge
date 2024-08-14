import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Feedback from './components/Feedback';
import Admin from './components/Admin';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import VerseHistory from './components/VerseHistory';
import Settings from './components/Settings';
import PwaPrompt from './components/PwaPrompt';
import './assets/css/style.css';

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [category, setCategory] = useState('all-verses');
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isPwaPromptVisible, setPwaPromptVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  let usedVerses = [];

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration') || sessionStorage.getItem('tokenExpiration');

    if (token && tokenExpiration) {
      const currentTime = new Date().getTime();
      if (currentTime > tokenExpiration) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
      }
    }
  }, []);

  const startGame = (gameID, selectedDifficulty, selectedCategory) => {
    localStorage.removeItem('gameCompleted'); // Clear gameCompleted flag
    setDifficulty(selectedDifficulty);
    setCategory(selectedCategory);
    navigate('/game', { state: { difficulty: selectedDifficulty, category: selectedCategory, gameID } });
};

  const endGame = (finalScore) => {
    setScore(finalScore);
    localStorage.setItem('latestDifficulty', difficulty);
    navigate('/leaderboard', { state: { score: finalScore, difficulty, category, username } });
  };

  const handleStartScreen = () => {
    navigate('/');
  };

  const handlePwaPromptClose = () => {
    setPwaPromptVisible(false);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<StartScreen startGame={startGame} />} />
        <Route path="/game" element={<Game difficulty={difficulty} category={category} endGame={endGame} usedVerses={usedVerses} username={username} />} />
        <Route path="/leaderboard" element={<Leaderboard score={score} difficulty={difficulty} category={category} onStartScreen={handleStartScreen} />} />
        <Route path="/feedback" element={<Feedback username={username} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute element={Admin} />} />
        <Route path="/history" element={<VerseHistory />} />
        <Route path="/settings" element={<Settings startGame={startGame} />} />
      </Routes>
      {location.pathname === '/' && <PwaPrompt isVisible={isPwaPromptVisible} onClose={handlePwaPromptClose} />}
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