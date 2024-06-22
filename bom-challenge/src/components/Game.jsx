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
          // Max 100
          if (Math.abs(guess.chapter - correct.chapter) <= 5 && Math.abs(guess.verse - correct.verse) <= 10) {
            if (guess.chapter === correct.chapter && guess.verse === correct.verse) {
              return 100;
            } else if (guess.chapter === correct.chapter && Math.abs(guess.verse - correct.verse) <=10) {
              return 50;
            } else if (Math.abs(guess.chapter - correct.chapter) <=5 && Math.abs(guess.verse - correct.verse) <=10) {
              return 25;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'medium':
          // Max 200
          if (Math.abs(guess.chapter - correct.chapter) <= 3 && Math.abs(guess.verse - correct.verse) <= 6) {
            if (guess.chapter === correct.chapter && guess.verse === correct.verse) {
              return 100;
            } else if (guess.chapter === correct.chapter && Math.abs(guess.verse - correct.verse) <=6) {
              return 50;
            } else if (Math.abs(guess.chapter - correct.chapter) <=3 && Math.abs(guess.verse - correct.verse) <=6) {
              return 25;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'hard':
          // Max 300
          if (Math.abs(guess.chapter - correct.chapter) <= 1 && Math.abs(guess.verse - correct.verse) <= 2) {
            if (guess.chapter === correct.chapter && guess.verse === correct.verse) {
              return 100;
            } else if (guess.chapter === correct.chapter && Math.abs(guess.verse - correct.verse) <=2) {
              return 50;
            } else if (Math.abs(guess.chapter - correct.chapter) <=1 && Math.abs(guess.verse - correct.verse) <=2) {
              return 25;
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