import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import UsernameEntry from './components/Username'; // Import UsernameEntry component

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState(''); // State for username
  const navigate = useNavigate();
  let usedVerses = [];

  const startGame = (gameID, selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    navigate('/game');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    navigate('/leaderboard', { state: { score: finalScore } });
  };

  const handleStartScreen = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartScreen startGame={startGame} />} />
        <Route path="/game" element={<Game difficulty={difficulty} endGame={endGame} usedVerses={usedVerses} username={username} />} />
        <Route path="/leaderboard" element={<Leaderboard score={score} onStartScreen={handleStartScreen} />} />
        <Route path="/username" element={<UsernameEntry startGame={startGame} setUsername={setUsername} />} /> {/* Route for UsernameEntry */}
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