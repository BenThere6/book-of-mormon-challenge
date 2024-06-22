import React, { useState } from 'react';
import verses from '../verses'; // Import your verses database

function Game({ difficulty, endGame }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentVerse, setCurrentVerse] = useState(getRandomVerse());
  const [userGuess, setUserGuess] = useState({ book: '', chapter: '', verse: '' });

  function getRandomVerse() {
    const keys = Object.keys(verses);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  const handleSubmit = () => {
    const correctReference = currentVerse.split(' ');
    const [correctBook, correctChapterVerse] = [correctReference[0], correctReference[1]];
    const [correctChapter, correctVerse] = correctChapterVerse.split(':');

    const guessAccuracy = calculateAccuracy(userGuess, { book: correctBook, chapter: correctChapter, verse: correctVerse });

    if (guessAccuracy) {
      setScore(score + guessAccuracy);
      setCurrentVerse(getRandomVerse());
    } else {
      setLives(lives - 1);
    }

    if (lives === 0) {
      endGame(score);
    }
  };

  const calculateAccuracy = (guess, correct) => {
    const chapterDifference = Math.abs(guess.chapter - correct.chapter);
    const verseDifference = Math.abs(guess.verse - correct.verse);

    if (guess.book === correct.book) {
      switch (difficulty) {
        case 'easy':
          return chapterDifference <= 3 && verseDifference <= 10 ? 100 : 0;
        case 'medium':
          return chapterDifference <= 2 && verseDifference <= 5 ? 200 : 0;
        case 'hard':
          return chapterDifference <= 1 && verseDifference <= 2 ? 300 : 0;
        default:
          return 0;
      }
    }
    return 0;
  };

  return (
    <div>
      <h2>Score: {score}</h2>
      <h2>Lives: {lives}</h2>
      <p>{verses[currentVerse]}</p>
      <input type="text" placeholder="Book" value={userGuess.book} onChange={(e) => setUserGuess({ ...userGuess, book: e.target.value })} />
      <input type="number" placeholder="Chapter" value={userGuess.chapter} onChange={(e) => setUserGuess({ ...userGuess, chapter: e.target.value })} />
      <input type="number" placeholder="Verse" value={userGuess.verse} onChange={(e) => setUserGuess({ ...userGuess, verse: e.target.value })} />
      <button onClick={handleSubmit}>Submit Guess</button>
    </div>
  );
}

export default Game;