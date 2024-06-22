import React, { useState } from 'react';

function StartScreen({ startGame }) {
  const [difficulty, setDifficulty] = useState('easy');

  const handleStart = () => {
    startGame(difficulty);
  };

  return (
    <div>
      <h1>Book of Mormon Challenge</h1>
      <label>
        Choose Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button onClick={handleStart}>Start Game</button>
    </div>
  );
}

export default StartScreen;