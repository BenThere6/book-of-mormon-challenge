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

  return (
    <div className="start-screen">
      <h1>Lehi's Legacy</h1>
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
      <div className="start-button-container">
        <Button variant="contained" onClick={handleStart}>Start Game</Button>
        <Button variant="contained" onClick={() => navigate('/leaderboard')}>View Leaderboard</Button>
      </div>
    </div>
  );
}

export default StartScreen;