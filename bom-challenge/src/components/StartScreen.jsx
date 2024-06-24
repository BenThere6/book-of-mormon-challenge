import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function StartScreen({ startGame }) {
  const [difficulty, setDifficulty] = useState('easy');

  const handleStart = () => {
    startGame(difficulty);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Mormon's Mastery</h1>
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
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" onClick={handleStart}>Start Game</Button>
      </div>
    </div>
  );
}

export default StartScreen;