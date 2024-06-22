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

    if (guessAccuracy > 0) {
      setScore(score + guessAccuracy);
      setCurrentVerse(getRandomVerse());
      setUserGuess({ book: '', chapter: '', verse: '' }); // Reset guess inputs
    } else {
      setLives(lives - 1);
      setUserGuess({ ...userGuess, verse: '' }); // Only reset the verse input on incorrect guess
    }

    if (lives === 1) { // Check lives before decrementing
      endGame(score);
    }
  };

  const calculateAccuracy = (guess, correct) => {
    const chapterDifference = Math.abs(guess.chapter - correct.chapter);
    const verseDifference = Math.abs(guess.verse - correct.verse);

    if (guess.book === correct.book) {
      switch (difficulty) {
        case 'easy':
          if (chapterDifference <= 5 && verseDifference <= 10) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 100;
            } else if (chapterDifference === 0 && verseDifference <= 10) {
              return 50;
            } else if (chapterDifference <= 5 && verseDifference <= 10) {
              return 25;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'medium':
          if (chapterDifference <= 3 && verseDifference <= 6) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 200;
            } else if (chapterDifference === 0 && verseDifference <= 6) {
              return 100;
            } else if (chapterDifference <= 3 && verseDifference <= 6) {
              return 50;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'hard':
          if (chapterDifference <= 1 && verseDifference <= 2) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 300;
            } else if (chapterDifference === 0 && verseDifference <= 2) {
              return 150;
            } else if (chapterDifference <= 1 && verseDifference <= 2) {
              return 75;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        default:
          return 0;
      }
    } else {
      return 0;
    }
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