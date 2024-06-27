import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start');
  const navigate = useNavigate();

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('game');
    navigate('/game');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('leaderboard');
    navigate('/leaderboard');
  };

  const handleStartScreen = () => {
    setGameState('start');
    navigate('/');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartScreen startGame={startGame} />} />
        <Route path="/game" element={<Game difficulty={difficulty} endGame={endGame} />} />
        <Route path="/leaderboard" element={<Leaderboard score={score} onStartScreen={handleStartScreen} />} />
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