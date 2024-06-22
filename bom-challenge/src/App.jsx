import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css'; // Import your CSS styles here

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start');

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('game');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('leaderboard');
  };

  return (
    <div className="App">
      {gameState === 'start' && <StartScreen startGame={startGame} />}
      {gameState === 'game' && <Game difficulty={difficulty} endGame={endGame} />}
      {gameState === 'leaderboard' && <Leaderboard score={score} />}
    </div>
  );
}

export default App;
