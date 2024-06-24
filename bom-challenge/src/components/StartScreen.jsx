import React, { useState } from 'react';

function StartScreen({ startGame }) {
  const [difficulty, setDifficulty] = useState('easy');

  const handleStart = () => {
    startGame(difficulty);
  };

  const difficultyDetails = {
    easy: { multiplier: 1, chapterRange: 8, verseRange: 12 },
    medium: { multiplier: 8, chapterRange: 7, verseRange: 10 },
    hard: { multiplier: 12, chapterRange: 3, verseRange: 4 },
  };

  const selectedDifficultyDetails = difficultyDetails[difficulty];

  return (
    <div>
      <h1>Book of Mormon Challenge</h1>
      <div>
        <button onClick={() => setDifficulty('easy')}>Easy</button>
        <button onClick={() => setDifficulty('medium')}>Medium</button>
        <button onClick={() => setDifficulty('hard')}>Hard</button>
      </div>
      <div>
        <p><strong>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</strong></p>
        {difficulty === 'easy' && <p>This difficulty uses exclusively scripture mastery verses.</p>}
        <p>Points Multiplier: {selectedDifficultyDetails.multiplier}</p>
        <p>Chapter Range: {selectedDifficultyDetails.chapterRange}</p>
        <p>Verse Range: {selectedDifficultyDetails.verseRange}</p>
      </div>
      <button onClick={handleStart}>Start Game</button>
    </div>
  );
}

export default StartScreen;