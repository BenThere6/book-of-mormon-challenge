import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import '../assets/css/StartScreen.css';

function StartScreen() {
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game', { state: { difficulty } });
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { state: { fromStartScreen: true } });
  };

  const getDifficultyDescription = () => {
    switch (difficulty) {
      case 'easy':
        return 'Practice scripture mastery verses!';
      case 'medium':
        return 'A balanced challenge.';
      case 'hard':
        return 'Test your knowledge!';
      default:
        return '';
    }
  };

  return (
    <div className="start-screen">
      <h1>Lehi's Legacy</h1>
      <Button variant="text" onClick={handleViewLeaderboard}>View Leaderboard</Button>
      <div className="button-group">
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setDifficulty('easy')}
            color={difficulty === 'easy' ? 'primary' : 'inherit'}
          >
            Easy
          </Button>
          <Button
            onClick={() => setDifficulty('medium')}
            color={difficulty === 'medium' ? 'primary' : 'inherit'}
          >
            Medium
          </Button>
          <Button
            onClick={() => setDifficulty('hard')}
            color={difficulty === 'hard' ? 'primary' : 'inherit'}
          >
            Hard
          </Button>
        </ButtonGroup>
      </div>
      <p>{getDifficultyDescription()}</p>
      <div className="start-button-container">
        <Button variant="contained" onClick={handleStart}>Start Game</Button>
      </div>
    </div>
  );
}

export default StartScreen;